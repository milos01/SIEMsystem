using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Diagnostics.Eventing.Reader;

namespace WindowsServiceAgent
{
    public static class Library
    {
        public static void writeLog(string log, string fileName)
        {
            StreamWriter sw = null;

            sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\" + fileName, true);
            sw.WriteLine(log);
            sw.Flush();
            sw.Close();
        }

        public static void writeLastReadLogs(string line)
        {

        }

        public static void readLastWrittenLogs(string eventFile)
        {
            //var lines = File.ReadLines("");
            //foreach (var line in lines)
        }

        public static void readEventFile(object fileName)
        {
            string systemDirectory = Path.GetPathRoot(Environment.SystemDirectory);
            string filePath = systemDirectory + @"Windows\System32\winevt\Logs\" + fileName.ToString();
            DateTime lastModified = File.GetLastWriteTime(filePath);
            using (var reader = new System.Diagnostics.Eventing.Reader.EventLogReader(filePath, PathType.FilePath))
            {

                EventRecord record;
                while ((record = reader.ReadEvent()) != null)
                {
                    using (record)
                    {
                        string eventData = record.TimeCreated + record.LevelDisplayName + ":" + record.FormatDescription();
                        writeLog(eventData, "Setup.txt");
                        //Console.WriteLine("{0} {1}: {2}", record.TimeCreated, record.LevelDisplayName, record.FormatDescription());
                    }
                }
            }
        }

    }
}
