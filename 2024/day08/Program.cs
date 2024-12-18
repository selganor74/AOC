var map = File.ReadAllLines("input.txt");

Dictionary<Antenna, List<Vector>> ExtractAntennas(string[] map)
{
    var antennas = new Dictionary<Antenna, List<Vector>>();

    for (int y = 0; y < map.Length; y++)
    {
        for (int x = 0; x < map[y].Length; x++)
        {
            var location = map[y][x];
            if (location == '.') continue;

            var a = new Antenna(location);

            if (!antennas.ContainsKey(a))
                antennas.Add(a, new List<Vector>());

            antennas[a].Add(new Vector(x, y));
        }
    }
    return antennas;
}

List<string> BuildAntinodesMap(string[] map) {
    var antinodes = new List<string>();
    for (int y = 0; y < map.Length; y++)
    {
        var row = "";
        for (int x = 0; x < map[y].Length; x++)
        {
            row += " ";
        }
        antinodes.Add(row);
    }
    return antinodes;
}

var antennas = ExtractAntennas(map);
var antinodes = BuildAntinodesMap(map);

foreach (var antenna in antennas.Keys)
{
    var positions = antennas[antenna];
    while (positions.Count() > 0)
    {
        var a = positions.First();
        positions.RemoveAt(0);
        foreach (var o in positions)
        {
            var antinode1 = o - (a - o);
            var antinode2 = a + (a - o);
            DrawAntinode(antinodes, antinode1);
            DrawAntinode(antinodes, antinode2);
        }
    }
}
// map.Dump();
// antinodes.Dump();
Console.WriteLine("Part1: " + antinodes.CountHashes());


antennas = ExtractAntennas(map);
antinodes =  BuildAntinodesMap(map);

foreach (var antenna in antennas.Keys)
{
    var positions = antennas[antenna];
    while (positions.Count() > 0)
    {
        var a = positions.First();
        positions.RemoveAt(0);
        foreach (var o in positions)
        {
            antinodes.DrawChar('#', o);
            antinodes.DrawChar('#', a);
            Vector antinode1;
            var p1 = a;
            var p2 = o;
            do
            {
                antinode1 = p2 - (p1 - p2);
                p1 = p2;
                p2 = antinode1;
            }
            while (antinodes.DrawChar('#', antinode1));

            Vector antinode2;
            p1 = a;
            p2 = o;
            do
            {
                antinode2 = p1 + (p1 - p2);
                p2 = p1;
                p1 = antinode2;
            }
            while (antinodes.DrawChar('#', antinode2));
        }
    }
}
// map.Dump();
// antinodes.Dump();
Console.WriteLine("Part2: " + antinodes.CountHashes());

bool DrawAntinode(List<string> antinodes, Vector position)
{
    if (position.Y < 0 || position.Y >= antinodes.Count) return false;
    if (position.X < 0 || position.X >= antinodes[0].Length) return false;
    antinodes[position.Y] = antinodes[position.Y].Substring(0, position.X) + "#" + antinodes[position.Y].Substring(position.X + 1, antinodes[position.Y].Length - position.X - 1);
    return true;
}


public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);

    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
}

public readonly record struct Antenna(char Frequency);

public static class MapExtensions
{
    public static void Dump(this IEnumerable<string> map)
    {
        foreach (var s in map)
        {
            Console.WriteLine(s);
        }
    }

    public static long CountHashes(this IEnumerable<string> map)
    {
        long toReturn = 0;
        foreach (var s in map)
        {
            foreach (var c in s)
            {
                if (c == '#') toReturn++;
            }
        }
        return toReturn;
    }

    public static void Clean(this List<string> map)
    {
        for (int y = 0; y < map.Count; y++)
            map[y] = string.Create<object>(map[y].Length, new object(), (o, j) => o.Fill(' '));
    }

    public static bool DrawChar(this List<string> map, char toDraw, Vector position)
    {
        if (position.Y < 0 || position.Y >= map.Count) return false;
        if (position.X < 0 || position.X >= map[0].Length) return false;
        map[position.Y] = map[position.Y].Substring(0, position.X) + toDraw + map[position.Y].Substring(position.X + 1, map[position.Y].Length - position.X - 1);
        return true;
    }
}