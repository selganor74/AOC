using System.Net.Http.Headers;

var lines = File.ReadAllLines("input.txt");

static bool IsOrdered(List<int[]> rules, int[] update)
{
    for (int i = 0; i < update.Length - 1; i++)
    {
        for (int v = i + 1; v < update.Length; v++)
        {
            var rule = rules.FirstOrDefault(r => r[0] == update[i] && r[1] == update[v]);
            if (rule is null) return false;
        }
    }
    return true;
}

List<string> pageOrderingRulesSection = new();
List<string> pagesForUpdateSection = new();
foreach (var row in lines)
{
    if (row.Contains('|'))
    {
        pageOrderingRulesSection.Add(row);
        continue;
    }
    if (row.Contains(','))
    {
        pagesForUpdateSection.Add(row);
        continue;
    }
}

var rules = pageOrderingRulesSection.Select(x => x.Split('|').Select(int.Parse).ToArray()).ToList();
var updates = pagesForUpdateSection.Select(x => x.Split(',').Select(int.Parse).ToArray()).ToList();


var part1 = updates.Where(u => IsOrdered(rules, u)).Select(u => u[u.Length / 2]).Sum();
Console.WriteLine($"Part1: {part1}");

var incorrectlyOrdered = updates.Where(u => !IsOrdered(rules, u)).ToList();
var part2 = incorrectlyOrdered.Select(update =>
        {
            retry:
            for (int i = 0; i < update.Length - 1; i++)
            {
                for (int v = i + 1; v < update.Length; v++)
                {
                    var rule = rules.FirstOrDefault(r => r[0] == update[i] && r[1] == update[v]);
                    if (rule is null)
                    {
                        // this element is not in the right order so we swap 
                        var temp = update[i];
                        update[i] = update[v];
                        update[v] = temp;
                        goto retry; 
                    }
                }
            }
            // when we don't fall in the goto, the thing is ordered
            return update;

        })
    .Select(u => u[u.Length / 2]).Sum();

Console.WriteLine($"Part2: {part2}");
