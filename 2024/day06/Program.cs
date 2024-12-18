var map = File.ReadAllLines("input.txt");

var sizeX = map.First().Length;
var sizeY = map.Length;

var guard = new Guard();

// Find the start position;
var found = false;

for (var y = 0; y < sizeY; y++)
{
    for (var x = 0; x < sizeX; x++)
    {
        if (map[y][x] == '^')
        {
            guard.Position = new Vector(x, y);
            found = true;
        }
        if (found) break;
    }
    if (found) break;
}

// while the guard walks, we count the number
// of distinct cells walked and we look for 
// potential loops
var obstacles = new List<Vector?>();
var obstacle = guard.SearchForLoops(map.CopyAndClean());
if (obstacle is not null)
    obstacles.Add(obstacle);
while (guard.Advance(map))
{
    obstacle = guard.SearchForLoops(map.CopyAndClean());
    if (obstacle is not null)
        obstacles.Add(obstacle);
}

foreach (var row in map)
    Console.WriteLine(row);

var part1 = guard.DistinctCells;
Console.WriteLine($"Part1: {part1}");

Console.WriteLine($"Part2: {obstacles.Distinct().Count()}");

public record struct Vector(int x, int y)
{
    public static Vector operator +(Vector a) => a;

    public static Vector operator -(Vector a) => new Vector(-a.x, -a.y);

    public static Vector operator +(Vector a, Vector b) => new Vector(a.x + b.x, a.y + b.y);

    public static Vector operator -(Vector a, Vector b) => a + (-b);
};

public class Guard
{
    private readonly Dictionary<char, Vector> Directions = new Dictionary<char, Vector> {
        {'^', new Vector( 0,-1) },
        {'>', new Vector( 1, 0) },
        {'V', new Vector( 0, 1) },
        {'<', new Vector(-1, 0) }
    };

    public Vector Position = new Vector(0, 0);

    public char Direction { get; set; } = '^';

    public int DistinctCells { get; private set; } = 1;

    public Guard() { }
    private Guard(Guard src)
    {
        Position = src.Position;
        Direction = src.Direction;
    }

    public Guard Copy()
    {
        return new Guard(this);
    }

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
        var peekPos = Position + dir;

        if (peekPos.x < 0 || peekPos.x >= map.First().Length || peekPos.y < 0 || peekPos.y >= map.Length)
            return ' ';

        return map[peekPos.y][peekPos.x];
    }

    private int Move(string[] map, Vector v)
    {
        int toReturn = 1;
        if (GetValueFromMapRelative(map, v) == 'X')
            toReturn = 0;

        map.DrawChar(Position, 'X');
        Position += v;
        map.DrawChar(Position, Direction);
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

        map.DrawChar(Position, Direction);
    }

    public Vector? SearchForLoops(string[] map)
    {
        var newGuard = this.Copy();
        var start = this.Copy();

        var dir = Directions[newGuard.Direction];

        var next = newGuard.GetValueFromMapRelative(map, dir);
        if (next == '#' || next == ' ') return null;

        var obstaclePos = newGuard.Position + dir;
        map.DrawChar(obstaclePos, '#');

        var steps = 0;
        var MAX_STEPS = 8192;
        var path = new List<string[]>() { map.Copy() };
        var positions = new List<Guard>() { newGuard.Copy() };

        while (newGuard.Advance(map) && steps < MAX_STEPS)
        {
            if (positions.Any(p => p.Position == newGuard.Position && p.Direction == newGuard.Direction))
            {
                // foreach (var m in path)
                // {
                //     m.Dump();
                //     Thread.Sleep(20);
                // }
                // Console.WriteLine("Loop Length: " + positions.Count);
                // Console.ReadKey(true);
                return obstaclePos;
            }
            steps++;
            path.Add(map.Copy());
            positions.Add(newGuard.Copy());
        }

        if (steps >= MAX_STEPS)
        {
            foreach (var m in path)
            {
                m.Dump();
                Thread.Sleep(20);
            }
            Console.WriteLine("Loop Length: " + positions.Count);
            Console.ReadKey(true);
        }
        return null;
    }
}

public static class MapExtensions
{
    public static string[] Copy(this string[] src)
    {
        return src.Select(x => x).ToArray();
    }

    public static string[] CopyAndClean(this string[] src)
    {
        return src.Select(x => x.Replace("X", ".")).ToArray();
    }

    public static void Dump(this string[] src)
    {
        Console.Clear();
        foreach (var x in src)
            Console.WriteLine(x);
    }

    public static void DrawChar(this string[] map, Vector pos, char c)
    {
        map[pos.y] = map[pos.y].Substring(0, pos.x) + c + map[pos.y].Substring(pos.x + 1, map[pos.y].Length - pos.x - 1);
    }
}