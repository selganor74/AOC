var stones = File.ReadAllLines("input.txt")[0].Split(' ').Select(long.Parse).ToList();

List<long> newArrangement = GetStoneArrangementAfterNBlinks(ref stones, 25);

var part1 = newArrangement.Count();
Console.WriteLine($"Part1: {part1}");

bool HasEvenDigits(long stone)
{
    return 0 == (stone.ToString().Length % 2);
}

IEnumerable<long> SplitStone(long stone)
{
    var asString = stone.ToString();
    var first = asString.Substring(0, asString.Length / 2);
    var second = asString.Substring(asString.Length / 2, asString.Length / 2);

    return [long.Parse(first), long.Parse(second)];
}

List<long> GetStoneArrangementAfterNBlinks(ref List<long> stones, int totalBlinks)
{
    List<long> newArrangement = [];
    for (var blink = 1; blink <= totalBlinks; blink++)
    {
        newArrangement = [];

        foreach (var stone in stones)
        {
            if (stone == 0)
            {
                newArrangement.Add(1);
                continue;
            }

            if (HasEvenDigits(stone))
            {
                newArrangement.AddRange(SplitStone(stone));
                continue;
            }

            newArrangement.Add(stone * 2024);
        }

        stones = newArrangement;
    }

    return newArrangement;
}