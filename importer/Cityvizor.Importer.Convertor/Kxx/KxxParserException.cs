﻿namespace Cityvizor.Importer.Convertor.Kxx;
public class KxxParserException : Exception
{
    public KxxParserException()
    {
    }

    public KxxParserException(string message)
        : base(message)
    {
    }

    public KxxParserException(string message, Exception inner)
        : base(message, inner)
    {
    }
}