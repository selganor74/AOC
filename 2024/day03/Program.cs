using System.Text.RegularExpressions;

var lines = File.ReadAllLines("input.txt");

Regex mulMatcher = new(@"mul\(([0-9]{1,3})\,([0-9]{1,3})\)");

int part1 = 0;
foreach (var line in lines)
{
    var match = mulMatcher.Match(line);
    if (!match.Success) continue;
    do
    {
        var m1 = int.Parse(match.Groups[1].Value);
        var m2 = int.Parse(match.Groups[2].Value);

        // Console.WriteLine($"{match.Value}: {m1} * {m2} = {m1 * m2}");
        part1 += m1*m2;
        match = match.NextMatch();
    } while (!string.IsNullOrWhiteSpace(match.Groups[1].Value));
}
Console.WriteLine($"Part1: {part1}");