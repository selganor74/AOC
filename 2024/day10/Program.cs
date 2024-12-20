var map = File.ReadAllLines("input.txt");

map.Beautify().Dump();

var part1 = map.GetStartingPoints()
    .Select(sp =>
    {
        var trails = map.GetFinalPositions(sp, 1, [sp]).Distinct().Count();
        // Console.WriteLine($"Trails for {sp}: {trails}");
        return trails;
    })
    .DefaultIfEmpty(0).Sum();

// var part1 = map.GetFinalPositions(new Vector(0,6),1,[]).Distinct().Count();
Console.WriteLine("Part1: " + part1);

public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);

    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
}



public static class Map
{
    public delegate T ScanAnalyzer<T>(Vector currentPoint, char valueAtCurrentPoint, string[] map);

    public class DoNotPassThisValue : Exception;

    public static IEnumerable<T> Scan<T>(this string[] map, ScanAnalyzer<T> scanAnalyzer)
    {
        for (int y = 0; y < map.Length; y++)
        {
            for (int x = 0; x < map[y].Length; x++)
            {
                T result;
                try
                {
                    result = scanAnalyzer.Invoke(new Vector(x, y), map[y][x], map);
                }
                catch (DoNotPassThisValue)
                {
                    // This is expected
                    continue;
                }
                yield return result;
            }
        }
    }

    public static IEnumerable<Vector> GetFinalPositions(this string[] map, Vector sp, int nextValue, Vector[] path)
    {
        if (nextValue >= 10)
        {
            //Console.WriteLine($"Trail completed at {sp}");
            yield return sp;
        }

        var toReturn = new List<Vector>();
        var nextSteps = map.ValidStepsForValue(sp, nextValue, path);
        foreach (var step in nextSteps) {
            toReturn.AddRange(map.GetFinalPositions(step, nextValue + 1, [.. path, step]));
        }

        foreach(var finalPosition in toReturn)
            yield return finalPosition;

        // foreach(var finalPosition in map
        //     .ValidStepsForValue(sp, nextValue, path)
        //     .SelectMany(s => map.GetFinalPositions(s, nextValue + 1, [.. path, s]))) {
        //         yield return finalPosition;
        //     }
    }

    public static IEnumerable<Vector> ValidStepsForValue(this string[] map, Vector fromPos, int nextValue, Vector[] path)
    {
        IEnumerable<Vector> directions = [
            new Vector( 0, -1), // UP
            new Vector( 1,  0), // RIGHT
            new Vector( 0,  1), // DOWN
            new Vector(-1,  0), // LEFT
        ];

        // Console.WriteLine($"Looking for next steps starting from {fromPos} for value {nextValue}");
        var validNextSteps = new List<Vector>();
        foreach (var direction in directions)
        {
            var pos = fromPos + direction;
            if (map.Fit(pos) && path.All(v => v != pos) && "" + map[pos.Y][pos.X] == "" + nextValue)
            {
                // Console.WriteLine($"Found next step moving {direction} at {pos} with value {nextValue}");
                validNextSteps.Add(pos);
            }
        }
        return validNextSteps;
    }

    public static bool Fit(this string[] map, Vector pos)
    {
        return pos.Y >= 0 && pos.Y < map.Length && pos.X >= 0 && pos.X < map[pos.Y].Length;
    }

    public static IEnumerable<Vector> GetStartingPoints(this string[] map)
    {
        return map.Scan((pos, val, map) =>
        {
            if (val == '0') return pos;

            throw new Map.DoNotPassThisValue();
        });
    }

    public static string[] Beautify(this string[] map)
    {
        //            0123456789
        var grades = "۞⠁⠊⠝⠽░▒▓▞X";
        var toReturn = new List<string>();
        foreach (var row in map)
        {
            var toAdd = "";
            foreach (var c in row)
            {
                toAdd += grades[int.Parse("" + c)];
            }
            toReturn.Add(toAdd);
        }
        return toReturn.ToArray();
    }

    public static void Dump(this IEnumerable<string> map)
    {
        foreach (var s in map)
        {
            Console.WriteLine(s);
        }
    }
}
