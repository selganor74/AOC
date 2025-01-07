var allInput = File.ReadAllLines("/home/administrator/develop/AOC/2024/day19/input.txt");

var towels = allInput[0].Split(", ").ToList();
var patterns = allInput.Skip(1).Where(l => !string.IsNullOrWhiteSpace(l)).ToList();
// foreach (var t in towels) Console.WriteLine($"'{t}'");

var possibleDesigns = 0;
var counter = 0;
foreach (var pat in patterns)
{
    counter++;

    if (IsPossible(pat, towels, new()))
    {
        possibleDesigns++;
        // Console.WriteLine($"Found " + possibleDesigns + " / " + patterns.Count);
    }
}

Console.WriteLine("part1: " + possibleDesigns);

static bool IsPossible(string remaining, List<string> towels, List<string> cache, int level = 0)
{
    if (cache.Contains(remaining)) return true;
    var matchingTowels = towels.Where(remaining.StartsWith).ToList();

    var toReturn = false;
    // Console.WriteLine($"[{level,4}] {remaining,-40}: Trying {matchingTowels.Count,3} towels at level {level,3} {string.Join(',', matchingTowels)}");
    foreach (var matching in matchingTowels)
    {
        var newRemaining = remaining.Substring(matching.Length).Trim();
        if (string.IsNullOrWhiteSpace(newRemaining))
        {
            // Console.WriteLine("Is Possible!");
            return true;
        }
        else
        {
            if (IsPossible(newRemaining, towels, cache, level + 1))
            {
                if (!cache.Contains(remaining)) cache.Add(remaining);
                toReturn = true;
            }
        }
    }

    return toReturn;
}
