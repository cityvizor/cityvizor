import csv
from time import strptime
from typing import TextIO, Iterable, List, Dict, Union

from .message import Message, Level


class Header:
    aliases: List[str] = []
    _real: str = ''

    def __init__(self, aliases: List[str]) -> None:
        super().__init__()
        self.aliases = aliases

    @property
    def real(self):
        return self._real if self._real != '' else self.aliases[0]

    @real.setter
    def real(self, value):
        self._real = value


class Parser:
    headers: Dict[str, Header] = {}

    @staticmethod
    def create(input_file: str) -> Union['Parser', None]:
        if input_file.endswith('_events.csv'):
            return EventsFileParser()
        if input_file.endswith('_data.csv'):
            return DataFileParser()
        return None

    def parse(self, input: TextIO) -> Iterable[Message]:
        reader = csv.DictReader(input, delimiter=';')
        errors: List[Message] = []

        self.__populate_headers(reader.fieldnames)

        errors += self.__validate_header_keys(reader.fieldnames)
        if any(m.level is Level.ERROR for m in errors):
            return errors

        for position, row in enumerate(reader):
            errors += self._validate_row(row, position + 1)

        return errors

    def _required_headers(self):
        return []

    def __populate_headers(self, keys: Iterable[str]):
        for key in keys:
            for header_key in self.headers.keys():
                if key in self.headers[header_key].aliases:
                    self.headers[header_key].real = key

    def __validate_header_keys(self, keys: Iterable[str]) -> Iterable[Message]:
        errors = []
        for key in keys:
            if key not in [f.real for f in self.headers.values()]:
                errors.append(Message(Level.WARNING, 0, 'Unknown key: "{}". It will be ignored.'.format(key)))
        for key in [self.headers[header].real for header in self._required_headers()]:
            if key not in keys:
                errors.append(Message(Level.ERROR, 0, 'Missing required key "{}".'.format(key)))
        return errors

    def _validate_row(self, row: Dict[str, str], line: int) -> Iterable[Message]:
        return []


class EventsFileParser(Parser):
    headers = {
        "id": Header(["id", "eventId", "srcId", "AKCE", "ORG"]),
        "name": Header(["name", "eventName", "AKCE_NAZEV"]),
        "description": Header(["description"]),
    }

    def _required_headers(self):
        return ['id', 'name']

    def _validate_row(self, row: Dict[str, str], line: int) -> Iterable[Message]:
        return super()._validate_row(row, line)


class DataFileParser(Parser):
    headers = {
        'type': Header(["type", "recordType", "MODUL", "DOKLAD_AGENDA"]),
        'paragraph': Header(["paragraph", "PARAGRAF"]),
        'item': Header(["item", "POLOZKA"]),
        'unit': Header(["unit", "ORJ"]),
        'event': Header(["eventId", "event", "AKCE", "ORG"]),
        'amount': Header(["amount", "CASTKA"]),
        'date': Header(["date", "DATUM", "DOKLAD_DATUM"]),
        'counterpartyId': Header(["counterpartyId", "SUBJEKT_IC"]),
        'counterpartyName': Header(["counterpartyName", "SUBJEKT_NAZEV"]),
        'description': Header(["description", "POZNAMKA"]),
    }

    def _required_headers(self):
        return ['type', 'paragraph', 'item', 'amount']

    def _validate_row(self, row: Dict[str, str], line: int) -> Iterable[Message]:
        errors: List[Message] = []
        data_type = row[self.headers['type'].real]
        data_counterparty_id = row[self.headers['counterpartyId'].real]
        data_counterparty_name = row[self.headers['counterpartyName'].real]
        data_description = row[self.headers['description'].real]

        if data_type not in [TYPE_KDF, TYPE_KOF]:
            if data_counterparty_id != '':
                errors.append(self.__type_warning(line, data_type, self.headers['counterpartyId'].real))
            if data_counterparty_name != '':
                errors.append(self.__type_warning(line, data_type, self.headers['counterpartyName'].real))
            if data_description != '':
                errors.append(self.__type_warning(line, data_type, self.headers['description'].real))

        errors += validate_int(line, self.headers['paragraph'].real, row[self.headers['paragraph'].real])
        errors += validate_int(line, self.headers['item'].real, row[self.headers['item'].real])
        errors += validate_empty_or_int(line, self.headers['event'].real, row[self.headers['event'].real])
        errors += validate_empty_or_int(line, self.headers['unit'].real, row[self.headers['unit'].real])
        errors += validate_float(line, self.headers['amount'].real, row[self.headers['amount'].real])
        errors += validate_empty_or_date(line, self.headers['date'].real, row[self.headers['date'].real])

        return errors

    def __type_warning(self, line: int, data_type: str, field: str) -> Message:
        return Message(
            Level.WARNING,
            line,
            '"{}" is processed for types "KDF" or "KOF" only. '
            'Type is "{}" so it will be skipped.'.format(field, data_type),
        )


TYPE_KDF = 'KDF'
TYPE_KOF = 'KOF'


def validate_int(line: int, key: str, value: str) -> Iterable[Message]:
    try:
        int(value)
        return []
    except ValueError:
        return [Message(
            Level.ERROR,
            line,
            '{} expected to be integer number. Actual value: "{}".'.format(key, value)
        )]


def validate_empty_or_int(line: int, key: str, value: str) -> Iterable[Message]:
    if value is None or value == '':
        return []
    return validate_int(line, key, value)


def validate_float(line: int, key: str, value: str) -> Iterable[Message]:
    try:
        float(value)
        return []
    except ValueError:
        return [Message(
            Level.ERROR,
            line,
            '{} expected to be float number. Actual value: "{}".'.format(key, value)
        )]


def validate_empty_or_date(line: int, key: str, value: str) -> Iterable[Message]:
    if value is None or value == '':
        return []
    try:
        strptime(value, '%Y-%m-%d')
        return []
    except ValueError:
        return [Message(
            Level.ERROR,
            line,
            '{} expected to be date in format "YYYY-MM-DD". Actual value: "{}".'.format(key, value)
        )]
