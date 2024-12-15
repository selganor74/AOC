using System.Reflection.Metadata;

var lines = File.ReadAllLines("input.txt");
var reports = lines.Select(x => x.Split(' ').Where(v => !string.IsNullOrWhiteSpace(v)).Select(v => int.Parse(v)).ToList());

static bool IsValidReport(List<int> report)
{
    var isFirst = true;
    var isThirdOrMore = false;
    int prevLevel = 0;
    int prevSign = 0;

    foreach (var level in report)
    {
        var step = Math.Abs(level - prevLevel);
        if (!isFirst && (step < 1 || step > 3))
        {
            return false;
        }
        if (!isFirst)
        {
            var sign = Math.Sign(level - prevLevel);
            if (isThirdOrMore && sign != prevSign)
            {
                return false;
            }
            prevSign = sign;
            isThirdOrMore = true;
        }
        prevLevel = level;
        isFirst = false;
    }

    return true;
}

var part1 = reports.Where(IsValidReport).Count();

Console.WriteLine($"Part1: {part1}");


var part2 = reports
    .Where(reportToPurge =>
        {
            // removes one level at a time from the report, and checks if the resulting value is valid
            for (int levelToPurge = 0; levelToPurge < reportToPurge.Count; levelToPurge++)
            {
                var report = new List<int>();
                for (var levelToAdd = 0; levelToAdd < reportToPurge.Count; levelToAdd++)
                {
                    if (levelToAdd == levelToPurge)
                        continue;

                    report.Add(reportToPurge[levelToAdd]);
                }

                if (IsValidReport(report))
                    return true;
            }

            return false;
        })
    .Count();

Console.WriteLine($"Part2: {part2}");

