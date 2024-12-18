var map = File.ReadAllLines("input.txt");
var antinodes = new List<string>();
var antennas = new Dictionary<Antenna, List<Vector>>();

var sizeX = map[0].Length;
var sizeY = map.Length;

for (int y = 0; y < map.Length; y++)
{
    var row = "";
    for (int x = 0; x < map[y].Length; x++)
    {
        row += " ";
        var location = map[y][x];
        if (location == '.') continue;

        var a = new Antenna(location);

        if (!antennas.ContainsKey(a))
            antennas.Add(a, new List<Vector>());

        antennas[a].Add(new Vector(x, y));
    }
    antinodes.Add(row);
}

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
map.Dump();
antinodes.Dump();
Console.WriteLine("Part1: " + antinodes.CountHashes());

void DrawAntinode(List<string> antinodes, Vector position)
{
    if (position.Y < 0 || position.Y >= antinodes.Count) return;
    if (position.X < 0 || position.X >= antinodes[0].Length) return;
    antinodes[position.Y] = antinodes[position.Y].Substring(0, position.X) + "#" + antinodes[position.Y].Substring(position.X + 1, antinodes[position.Y].Length - position.X - 1);
}


readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);

    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
}

readonly record struct Antenna(char Frequency);

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
                if( c == '#') toReturn++;
            }
        }
        return toReturn;
    }
}