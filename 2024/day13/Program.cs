using System.Diagnostics;
using System.Reflection;

var input = File
    .ReadAllLines("input.txt")
    .Where(x => !string.IsNullOrEmpty(x))
    .ToList();

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

var offset = new Vector(10000000000000, 10000000000000);
var part2PrizeList = prizeList.Select(p => p with { PrizePosition = p.PrizePosition + offset }).ToList();
var part2 = part2PrizeList.Sum(p => p.SmartTokenForPrize());
Console.WriteLine($"Part2: {part2}");

public readonly record struct ButtonStep(long XStep, long YStep)
{
    public static Vector ParseFromString(string input)
    {
        var xy = input.Split(':')[1].Split(',').Select(x => x.Split('+')[1]).Select(long.Parse).ToArray();
        return new Vector(xy[0], xy[1]);
    }
};

public readonly record struct PrizeInfo(Vector ButtonA, Vector ButtonB, Vector PrizePosition)
{
    readonly long buttonACost = 3;
    readonly long buttonBCost = 1;

    public long TokenForPrize()
    {
        var toReturn = long.MaxValue;

        for (long a = 0; a <= 100; a++)
        {
            for (long b = 0; b <= 100; b++)
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

        return toReturn == long.MaxValue ? 0 : toReturn;
    }

    public long SmartTokenForPrize()
    {
        /*   
             
             |
             |              >* prize
             |          >a
             |      >
             |  /
             | /b
             |/
            -------------------------------
            Two lines meeting at point (xx, yy)

                yy  = (a.y / a.x) * (xx - prize.x) + prize.y
                yy  = (b.y / b.x) *  xx  
                ----------------------------------------------------------------
                0   = (a.y / a.x) * (xx - prize.x) + prize.y - (b.y / b.x) * xx
                0   = (a.y / a.x) * xx - (a.y / a.x) * prize.x + prize.y - (b.y / b.x) * xx   
                0   = xx * (a.y / a.x - b.y / b.x) - (a.y / a.x) * prize.x + prize.y

                      prize.y - (a.y / a.x) * prize.x 
                xx  = ----------------------------------
                            (a.y / a.x - b.y / b.x)    

                                     prize.y - (a.y / a.x) * prize.x
                yy  = (b.y / b.x) * ---------------------------------
                                         (a.y / a.x - b.y / b.x)


            Solution is in the form 
            
                    n*a   + m*b   = prize
                    n*a.x + m*b.x = prize.x
                    n*a.y + m*b.y = prize.y

                    n*a.x   m*b.x   prize.x
                    ----- + ----- = -------
                    n*a.y   m*b.y   prize.y

                    n*a.x - n*a.y + m*b.x - m*b.y = prize.x - prize.y
                    n*(a.x - a.y) + m*(b.x - b.y) = prize.x - prize.y

                        prize.x - prize.y - m*(b.x - b.y)
                    n = ---------------------------------
                                 (a.x - a.y) 

                        prize.x - prize.y - n*(a.x - a.y)
                    m = ---------------------------------
                                 (b.x - b.y) 

            To get an integer m, 

                         prize.x - prize.y - n*(a.x - a.y)
                    mod( --------------------------------- ) = 0
                                  (b.x - b.y) 
        */

        /*
                      prize.y - (a.y / a.x) * prize.x 
                xx  = ----------------------------------
                            (a.y / a.x - b.y / b.x)    

                                     prize.y - (a.y / a.x) * prize.x
                yy  = (b.y / b.x) * ---------------------------------
                                         (a.y / a.x - b.y / b.x)
        */

        double xx = (PrizePosition.Y - (ButtonA.Y / ButtonA.X) * PrizePosition.X) / (ButtonA.Y / ButtonA.X - ButtonB.Y / ButtonB.X);
        double yy = (ButtonB.Y / ButtonB.X) * xx;

        var n = xx / ButtonA.X;
        var m = (PrizePosition.Y - yy) / ButtonB.Y;

        Console.WriteLine($"Prize: {PrizePosition}: xx: {xx}   yy: {yy}  [{n},{m}]");

        if (xx % ButtonA.X != 0) return 0;
        // if (yy % ButtonA.Y != 0) return 0;
        // if ((PrizePosition.X - xx) % ButtonB.X != 0) return 0;
        if ((PrizePosition.Y - yy) % ButtonB.Y != 0) return 0;


        long cost = Convert.ToInt64(Math.Truncate(n*buttonACost + m*buttonBCost));

        return cost;
    }
};

public readonly record struct Vector(double X, double Y)
{
    // public long LengthSquared => X * X + Y * Y;

    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
    public static Vector operator *(Vector v1, long s2) => new(v1.X * s2, v1.Y * s2);
    public static Vector operator *(long s2, Vector v1) => new(v1.X * s2, v1.Y * s2);

    public static Vector Parse(string input)
    {
        var xy = input.Split(':')[1].Split(',').Select(x => x.Split('=')[1]).Select(long.Parse).ToArray();
        return new Vector(xy[0], xy[1]);
    }
}