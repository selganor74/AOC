using System.Reflection.Metadata;

var lines = File.ReadAllLines("input.txt");
var reports = lines.Select(x => x.Split(' ').Where(v => !string.IsNullOrWhiteSpace(v)).Select(v => int.Parse(v)).ToList());

var part1 = reports.Where(report =>
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
})
.Count();
Console.WriteLine($"Part1: {part1}");