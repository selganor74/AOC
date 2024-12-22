using System.Collections.Frozen;
using System.Collections.Immutable;

var garden = File.ReadAllLines("input.txt").ToList();

List<CultureArea> allCultures = new();
Dictionary<Vector, char> toVisit = new();

for (int y = 0; y < garden.Count; y++)
{
    for (int x = 0; x < garden[y].Length; x++)
    {
        var position = new Vector(x, y);
        var culture = garden.ReadValue(position);
        toVisit.Add(position, culture);
    }
}


do
{
    var cultureElement = toVisit.ElementAt(0);
    toVisit.Remove(cultureElement.Key);

    CultureArea currentCulture = new(cultureElement.Value);
    currentCulture.AddCell(cultureElement.Key);

    var toExplore = toVisit
        .Where(e => Direction.All().Select(d => cultureElement.Key + d).Contains(e.Key) && e.Value == currentCulture.Culture)
        .ToList();
    do
    {
        foreach (var explored in toExplore.Distinct().ToList())
        {
            currentCulture.AddCell(explored.Key);
            toVisit.Remove(explored.Key);
            toExplore.Remove(explored);

            toExplore.AddRange(
                toVisit
                    .Where(e => Direction.All().Select(d => explored.Key + d).Contains(e.Key) && e.Value == currentCulture.Culture)
                    .ToList()
            );
        }
    } while (toExplore.Any());

    allCultures.Add(currentCulture);

    Console.WriteLine($"{currentCulture.Culture}: {currentCulture.Price,-10} For Bulk Discount: {currentCulture.GetSides(),4} {currentCulture.PriceForBulkDiscount,-10} to go: {toVisit.Count}");
} while (toVisit.Keys.Any());

long part1 = allCultures.Select(c => c.Price).Sum();
Console.WriteLine("Part 1: " + part1);

long part2 = allCultures.Select(c => c.PriceForBulkDiscount).Sum();
Console.WriteLine("Part 2: " + part2);

public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
};

public record CultureArea(char Culture)
{
    readonly Dictionary<Vector, Cell> _cells = [];

    public int Perimeter => _cells.Select(c => c.Value.Perimeter).Sum();

    public int Area => _cells.Keys.Count;

    public long Price => Area * Perimeter;

    public long PriceForBulkDiscount => Area * GetSides();

    public int GetSides()
    {
        var hSideCounter = new SideCounter();
        foreach (var column in _cells.OrderBy(c => c.Key.X).Select(c => c.Key.X).Distinct().ToList())
        {
            var yCells = _cells.Where(c => c.Key.X == column).OrderBy(c => c.Key.Y).Select(c => c.Key.Y).ToList();
            var iset = new IntervalSet(yCells);
            hSideCounter.Apply(iset);
        }

        var vSideCounter = new SideCounter();
        foreach (var row in _cells.OrderBy(c => c.Key.Y).Select(c => c.Key.Y).Distinct().ToList())
        {
            var xCells = _cells.Where(c => c.Key.Y == row).OrderBy(c => c.Key.X).Select(c => c.Key.X).ToList();
            var iset = new IntervalSet(xCells);
            // Console.WriteLine($"iSet:{iset.Intervals.Count}");

            vSideCounter.Apply(iset);
            // Console.WriteLine($"Count:{vSideCounter.Count}");
        }
        // Console.WriteLine($"hSide:{hSideCounter.Count}  vSide:{vSideCounter.Count}");
        return hSideCounter.Count + vSideCounter.Count;
    }

    public void AddCell(Vector position)
    {
        if (_cells.ContainsKey(position))
            return;

        var newCell = new Cell(position, Culture);
        _cells.Add(position, newCell);
        foreach (var direction in Direction.All())
        {
            if (_cells.ContainsKey(position + direction))
            {
                _cells[position + direction].ProcessNeighbor(newCell);
            }
        }
    }
}

public class Cell(Vector position, char culture)
{
    readonly Dictionary<Vector, bool> fences = new() {
        {Direction.North, true},
        {Direction.West, true},
        {Direction.South, true},
        {Direction.East, true},
    };

    public FrozenDictionary<Vector, bool> Fences => fences.ToFrozenDictionary();

    public Vector Position { get; } = position;
    public char Culture { get; } = culture;

    public int Perimeter => fences.Select(x => x.Value ? 1 : 0).Sum();

    public void ProcessNeighbor(Cell neighbor)
    {
        if (neighbor.Position == Position) return;
        foreach (var direction in Direction.All())
        {
            if (Position + direction == neighbor.Position)
            {
                fences[direction] = false;
                neighbor.fences[-direction] = false;
            };
        }
    }
}

public static class Direction
{
    public static Vector North => new Vector(0, -1);
    public static Vector West => new Vector(1, 0);
    public static Vector South => -North;
    public static Vector East => -West;

    public static IEnumerable<Vector> All()
    {
        yield return North;
        yield return West;
        yield return South;
        yield return East;
    }
}

public static class MapExtensions
{
    public static char ReadValue(this List<string> map, Vector position)
    {
        return map[position.Y][position.X];
    }

    public static void WriteValue(this List<string> map, char toWrite, Vector position)
    {
        var rowArray = map[position.Y].ToCharArray();
        rowArray[position.X] = toWrite;
        map[position.Y] = new string(rowArray);
    }
}

public readonly record struct Interval(int Start, int Stop)
{
    public int Length => Stop - Start + 1;

    public Interval? Intersect(Interval other)
    {
        var start = Math.Max(Start, other.Start);
        var stop = Math.Min(Stop, other.Stop);

        if (start <= stop) return new Interval(start, stop);

        return null;
    }
}

public class IntervalSet
{
    public List<Interval> Intervals = [];

    public IntervalSet(List<int> cells)
    {
        cells.Sort();
        int start = cells.First();
        int stop = start;

        for (int i = 1; i < cells.Count; i++)
        {
            if (cells[i] - cells[i - 1] == 1)
                stop = cells[i];
            else
            {
                AddInterval(new Interval(start, stop));
                start = cells[i];
                stop = start;
            }
        }

        AddInterval(new Interval(start, stop));
    }

    public void AddInterval(Interval i)
    {
        Intervals.Add(i);
        Intervals.Sort((a, b) => b.Start - a.Start);
    }
}

public class SideCounter
{
    public int Count { get; private set; }

    IntervalSet? lastIntervalSet = null;

    public void Apply(IntervalSet intSet)
    {
        if (lastIntervalSet is null)
        {
            Count = 2 * intSet.Intervals.Count;
            lastIntervalSet = intSet;
            return;
        }

        // Console.WriteLine($"Applying {intSet.Intervals.Count} to existing {lastIntervalSet.Intervals.Count} intervals.");
        List<int> unmatchedStarts = intSet.Intervals.Select(s => s.Start).ToList();
        List<int> unmatchedStops = intSet.Intervals.Select(s => s.Stop).ToList();

        foreach (var interval in lastIntervalSet.Intervals)
        {
            foreach (var tInt in intSet.Intervals)
            {
                var intersection = interval.Intersect(tInt);
                if (intersection is null)
                {
                    // Console.WriteLine($"{interval} with {tInt} do not intersect");
                    continue;
                }

                // Console.WriteLine($"Intersecting {interval} with {tInt} obtaining {intersection}");

                if (tInt.Start == interval.Start)
                    if (unmatchedStarts.Contains(tInt.Start))
                        unmatchedStarts.Remove(tInt.Start);

                if (tInt.Stop == interval.Stop)
                    if (unmatchedStops.Contains(tInt.Stop))
                        unmatchedStops.Remove(tInt.Stop);
            }
        }
        // Console.WriteLine($"Applied {intSet.Intervals.Count} intervals. Count is now {Count}");
        Count += unmatchedStarts.Count + unmatchedStops.Count;
        lastIntervalSet = intSet;
    }
}

/*
    X X
    XXX
    XXX
    X X
    XXX
    XXX
    25

    The number of sides to add at each step is the number of extremities (start and stop)
    that do not match with the previous intervals that intersect.
*/ 