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
        part1 += m1 * m2;
        match = match.NextMatch();
    } while (!string.IsNullOrWhiteSpace(match.Groups[1].Value));
}
Console.WriteLine($"Part1: {part1}");

Regex p2mulMatcher = new(@"do\(\)|don't\(\)|mul\(([0-9]{1,3})\,([0-9]{1,3})\)");

int part2 = 0;
bool mulEnabled = true;
foreach (var line in lines)
{
    var match = p2mulMatcher.Match(line);
    if (!match.Success) continue;
    do
    {
        if (match.Groups[0].Value.StartsWith("do"))
        {
            mulEnabled = match.Groups[0].Value == "do()";
            match = match.NextMatch();
            continue;
        }

        if (mulEnabled)
        {
            var m1 = int.Parse(match.Groups[1].Value);
            var m2 = int.Parse(match.Groups[2].Value);

            // Console.WriteLine($"{match.Value}: {m1} * {m2} = {m1 * m2}");
            part2 += m1 * m2;
        }
        match = match.NextMatch();
    } while (!string.IsNullOrWhiteSpace(match.Groups[0].Value));
}
Console.WriteLine($"Part2: {part2}");
