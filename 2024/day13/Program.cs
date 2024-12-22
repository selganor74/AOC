
var input = File.ReadAllLines("input.txt").Where(x => !string.IsNullOrEmpty(x)).ToList();
int i = 0;
List<PrizeInfo> prizeList = new();
do
{
    var buttonA = ButtonStep.ParseFromString(input[i]);
    i++;
    var buttonB = ButtonStep.ParseFromString(input[i]);
    i++;
    var prizePosition = Vector.Parse(input[i]);
    var prize = new PrizeInfo(buttonA, buttonB, prizePosition);
    prizeList.Add(prize);
    i++;
} while (i < input.Count);

Console.WriteLine($"Read {prizeList.Count} prize info");
var part1 = prizeList.Sum(p => p.TokenForPrize());
Console.WriteLine($"Part1: {part1}");

public readonly record struct ButtonStep(int XStep, int YStep)
{
    public static Vector ParseFromString(string input)
    {
        var xy = input.Split(':')[1].Split(',').Select(x => x.Split('+')[1]).Select(int.Parse).ToArray();
        return new Vector(xy[0], xy[1]);
    }
};

public readonly record struct PrizeInfo(Vector ButtonA, Vector ButtonB, Vector PrizePosition)
{
    readonly int buttonACost = 3;
    readonly int buttonBCost = 1;

    public int TokenForPrize()
    {
        var toReturn = int.MaxValue;
        
        for (int a = 0; a <= 100; a++)
        {
            for (int b = 0; b <= 100; b++)
            {
                Vector pos = (a * ButtonA) + (b * ButtonB);
                if (pos == PrizePosition)
                {
                    var cost = a * buttonACost + b * buttonBCost;
                    if (cost < toReturn)
                        toReturn = cost;
                }
            }
        }

        return toReturn == int.MaxValue ? 0 : toReturn;
    }
};

public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
    public static Vector operator *(Vector v1, int s2) => new(v1.X * s2, v1.Y * s2);
    public static Vector operator *(int s2, Vector v1) => new(v1.X * s2, v1.Y * s2);

    public static Vector Parse(string input)
    {
        var xy = input.Split(':')[1].Split(',').Select(x => x.Split('=')[1]).Select(int.Parse).ToArray();
        return new Vector(xy[0], xy[1]);
    }
}