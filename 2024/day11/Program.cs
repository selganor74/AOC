var stones1 = File
    .ReadAllLines("input.txt")[0]
    .Split(' ')
    .Select(long.Parse).ToList();

var part1 = GetNumberOfStones(stones1, 25);
Console.WriteLine($"Part1: {part1}");

var part2 = GetNumberOfStones(stones1, 75);
Console.WriteLine($"Part2: {part2}");

long GetNumberOfStones(List<long> stones, long maxLevel)
{
    var cache = new ResultCache();

    long result = 0;
    Parallel.ForEach(stones, (s) =>
    {
        var partial = GetNumberOfStone(s, 0, maxLevel, 1, cache);
        result += partial;
    });
    return result;
}

long GetNumberOfStone(long stone, long currentLevel, long maxLevel, long currentStones, ResultCache cache)
{
    if (currentLevel > maxLevel)
        return currentStones;

    if (maxLevel == currentLevel)
    {
        cache.AddIfNotPresent(stone, 0, 1);
        return 1;
    }

    var fromCache = cache.TryGet(stone, maxLevel - currentLevel);
    if (0 != fromCache)
        return fromCache;

    if (stone == 0)
    {
        var value = GetNumberOfStone(1, currentLevel + 1, maxLevel, currentStones, cache);
        cache.AddIfNotPresent(stone, maxLevel - currentLevel, value);
        return value;
    }

    if (HasEvenDigits(stone))
    {
        var newStones = SplitStone(stone);
        var value = GetNumberOfStone(newStones[0], currentLevel + 1, maxLevel, currentStones + 1, cache)
            + GetNumberOfStone(newStones[1], currentLevel + 1, maxLevel, 0, cache);
        cache.AddIfNotPresent(stone, maxLevel - currentLevel, value);
        return value;
    }

    var valueElse = GetNumberOfStone(stone * 2024, currentLevel + 1, maxLevel, currentStones, cache);
    cache.AddIfNotPresent(stone, maxLevel - currentLevel, valueElse);
    return valueElse;
}

bool HasEvenDigits(long stone)
{
    return 0 == (stone.ToString().Length % 2);
}

List<long> SplitStone(long stone)
{
    var asString = stone.ToString();
    var first = asString.Substring(0, asString.Length / 2);
    var second = asString.Substring(asString.Length / 2, asString.Length / 2);

    return [long.Parse(first), long.Parse(second)];
}

public class ResultCache
{
    private static Dictionary<long, Dictionary<long, long>> _cache = new();

    public void AddIfNotPresent(long stone, long computedBlinks, long resultingNumberOfStones)
    {
        lock (_cache)
        {
            if (computedBlinks == 0 && resultingNumberOfStones != 1)
                throw new InvalidOperationException($"Tried to Add to Cache! stone: {stone} @{computedBlinks} => {resultingNumberOfStones}");

            if (!_cache.ContainsKey(stone))
                _cache.Add(stone, new());

            var values = _cache[stone];
            if (!values.ContainsKey(computedBlinks))
            {
                // Console.WriteLine($"Added to Cache! stone: {stone} @{computedBlinks} => {resultingNumberOfStones}");
                values.Add(computedBlinks, resultingNumberOfStones);
            }
        }
    }

    public long TryGet(long stone, long computedBlinks)
    {
        lock (_cache)
        {
            if (!_cache.ContainsKey(stone))
                return 0;

            var values = _cache[stone];
            if (!values.ContainsKey(computedBlinks))
                return 0;

            var value = values[computedBlinks];
            // Console.WriteLine($"Cache hit! stone: {stone} @{computedBlinks} => {value}");
            return value;
        }
    }
}

/*
1           0

1           1

1           2024

2           *20                                                                                     24

4           2                                                       0                               2                                                       4

4           4048                                                    1                               4048                                                    8096

7           *40                     48                              2024                            40                      48                              80                      96

14          *4              0       4               8               20              24              4               0       4               8               8               0       9               6

16          8096            1       8096            16192           2       0       2       4       8096            1       8096            16192           16192           1       18216           12144

20          *80     96      2024    80      96      32772608        4048    1       4048    8096    80      96      2024    80      96      32772608        32772608        2024    36869184        24579456

39          *8  0   9   6   20  24  8   0   9   6   3277    2608    40  48  2024    40  48  80  96  8   0   9   6   20  24  8   0   9   6   3277    2608    3277    2608    20  24  3686    9184    2457    9456                                                                         
*/
