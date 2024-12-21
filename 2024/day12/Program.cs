using System.Collections.Frozen;

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
    Console.WriteLine($"{currentCulture.Culture}: {currentCulture.Price,-10} to go: {toVisit.Count}");
} while (toVisit.Keys.Any());

long part1 = allCultures.Select(c =>
{
    // Console.WriteLine(c.Culture + ": " + c.Price);
    return c.Price;
}).Sum();
Console.WriteLine("Part 1: " + part1);

public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
};

public record CultureArea(char Culture)
{

    Dictionary<Vector, Cell> Cells = new();

    public int Perimeter => Cells.Select(c => c.Value.Perimeter).Sum();

    public int Area => Cells.Keys.Count;

    public long Price => Area * Perimeter;

    public void AddCell(Vector position)
    {
        if (Cells.ContainsKey(position)) {
            return;
            // throw new InvalidOperationException($"Cannot set cell at {position} because it is set");
        }

        var newCell = new Cell(position, Culture);
        Cells.Add(position, newCell);
        foreach (var direction in Direction.All())
        {
            if (Cells.ContainsKey(position + direction))
            {
                Cells[position + direction].ProcessNeighbor(newCell);
            }
        }
    }
}

public class Cell(Vector position, char culture)
{
    Dictionary<Vector, bool> fences = new() {
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
