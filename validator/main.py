import argparse

from validator.lib.parser import Parser

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input', metavar='I', type=str, nargs=1)
    args = parser.parse_args()

    with open(args.input[0], 'r') as input:
        parser = Parser.create(input.name)
        if parser is None:
            print('No parser found for file "{}"'.format(input.name))
        else:
            result = parser.parse(input)
            print(result)
