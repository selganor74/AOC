var allInput = File.ReadAllLines("/home/administrator/develop/AOC/2024/day19/test.txt");

var towels = allInput[0].Split(", ").ToList();
var patterns = allInput.Skip(1).Where(l => !string.IsNullOrWhiteSpace(l)).ToList();
// foreach (var t in towels) Console.WriteLine($"'{t}'");

List<string> possibleDesigns = new();
var counter = 0;
foreach (var patt in patterns)
{
    counter++;

    if (IsPossible(patt, towels, new()))
    {
        possibleDesigns.Add(patt);
        // Console.WriteLine($"Found " + possibleDesigns + " / " + patterns.Count);
    }
}

Console.WriteLine("part1: " + possibleDesigns.Count);

var t = towels.OrderBy(t => t.Length).ThenBy(t => t);
Console.WriteLine(string.Join(',', t));

long part2 = 0;
// var pat = "bgru";
foreach (var pat in possibleDesigns)
{
    Console.WriteLine(pat + ": ");
    var ways = CountWays(pat, towels);
    Console.WriteLine(ways);
    part2 += ways;
}
Console.WriteLine("part2: " + part2);


static long CountWays(string design, List<string> towels, string patternSoFar = "")
{
    Dictionary<string, long> paths = new();
    var cache = new List<string>();
    for (int i = 1; i < design.Length; i++)
    {
        var toCheck = design.Substring(0, i);
        var remaining = design.Substring(i);
        var matchingTowels = towels.Where(toCheck.EndsWith).OrderBy(g => g.Length).ToList();
        foreach (var t in matchingTowels)
        {
            var rootPath = toCheck.Substring(0, toCheck.Length - t.Length);
            var remainingFromRoot = design.Substring(rootPath.Length);
            if (!paths.ContainsKey(rootPath))
                paths.Add(rootPath, 1);
            var remainingFromThis = design.Substring(toCheck.Length);
            var toAdd = IsPossible(remainingFromThis, towels, cache) ? 1 : 0;
            if (!paths.ContainsKey(toCheck))
                paths.Add(toCheck, toAdd);
            else
                paths[toCheck] += toAdd;
        }
        // Console.WriteLine(string.Join("->", waysAtLength));
    }
    foreach (var p in paths) Console.Write(p.Key + "(" + p.Value + ")  ");
    Console.WriteLine();
    return paths.Where(p => p.Value != 0).Aggregate((KeyValuePair<string, long> a, KeyValuePair<string, long> v) => KeyValuePair.Create(a.Key, a.Value * v.Value)).Value;
}


static bool IsPossible(string remaining, List<string> towels, List<string> cache, int level = 0)
{
    if (string.IsNullOrEmpty(remaining)) return true;
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
