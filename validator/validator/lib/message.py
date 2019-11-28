from enum import Enum


class Level(Enum):
    WARNING = 1
    ERROR = 2


class Message:
    level: Level = Level.WARNING
    line: int = 0
    description: str = ''

    def __init__(self, level: Level, line: int, description: str) -> None:
        super().__init__()
        self.level = level
        self.line = line
        self.description = description

    def __repr__(self) -> str:
        return '[{}] Line {}: {}'.format(self.level, self.line, self.description)
