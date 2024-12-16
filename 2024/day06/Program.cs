var map = File.ReadAllLines("input.txt");

var sizeX = map.First().Length;
var sizeY = map.Length;

var guard = new Guard();

var found = false;

for (var y = 0; y < sizeY; y++)
{
    for (var x = 0; x < sizeX; x++)
    {
        if (map[y][x] == '^')
        {
            guard.X = x;
            guard.Y = y;
            found = true;
        }
        if (found) break;
    }
    if (found) break;
}



while (guard.Advance(map))
{
    Console.Clear();
    // foreach (var row in map)
    //     Console.WriteLine(row);

    // Console.ReadKey(true);
}

foreach (var row in map)
    Console.WriteLine(row);

var part1 = guard.DistinctCells;
Console.WriteLine($"Part1: {part1}");

public record Vector(int x, int y);

public class Guard
{
    private readonly Dictionary<char, Vector> Directions = new Dictionary<char, Vector> {
        {'^', new Vector( 0,-1) },
        {'>', new Vector( 1, 0) },
        {'V', new Vector( 0, 1) },
        {'<', new Vector(-1, 0) }
    };

    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;

    public char Direction { get; set; } = '^';

    public int DistinctCells { get; private set; } = 1;

    public bool Advance(string[] map)
    {
        Vector dir = Directions[Direction];
        char next = GetValueFromMapRelative(map, dir);
        switch (next)
        {
            case ' ':
                return false;
            case '.':
            case 'X':
                DistinctCells += Move(map, dir);
                break;
            case '#':
                Rotate90CW(map);
                break;
        }
        return true;
    }

    private char GetValueFromMapRelative(string[] map, Vector dir)
    {
        var x = X + dir.x;
        var y = Y + dir.y;

        if (x < 0 || x >= map.First().Length || y < 0 || y >= map.Length)
            return ' ';

        Console.WriteLine($"[{x}, {y}]");
        return map[y][x];
    }

    private int Move(string[] map, Vector v)
    {
        int toReturn = 1;
        if (GetValueFromMapRelative(map, v) == 'X')
        {
            toReturn = 0;
        }
        map[Y] = map[Y].Substring(0, X) + 'X' + map[Y].Substring(X + 1, map[Y].Length - X -1);
        Y += v.y;
        X += v.x;
        map[Y] = map[Y].Substring(0, X) + Direction + map[Y].Substring(X + 1, map[Y].Length - X - 1);
        return toReturn;
    }

    private void Rotate90CW(string[] map)
    {
        switch (Direction)
        {
            case '^':
                Direction = '>';
                break;
            case '>':
                Direction = 'V';
                break;
            case 'V':
                Direction = '<';
                break;
            case '<':
                Direction = '^';
                break;
        }

        map[Y] = map[Y].Substring(0, X) + Direction + map[Y].Substring(X + 1, map[Y].Length - X - 1);
    }
}
