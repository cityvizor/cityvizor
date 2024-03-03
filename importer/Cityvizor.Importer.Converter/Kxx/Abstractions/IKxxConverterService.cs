using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cityvizor.Importer.Converter.Kxx.Abstractions;
public interface IKxxConverterService
{
    public KxxParser CreateParser(StreamReader stream);

    public KxxRecordBuilder CreateRecordBuilder();
}
