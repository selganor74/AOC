using System.Diagnostics;

var map = File.ReadAllLines("input.txt").ToList();
var nsSaved = 100;

map.Dump();

var startPosition = map.FindSymbol('S');
var endPosition = map.FindSymbol('E');

List<Cheat> cheats = FindCheats(map, nsSaved, startPosition, endPosition, 2);

Console.WriteLine("Part1: " + cheats.Count);

static List<Cheat> FindCheats(List<string> map, int nsSaved, Vector startPosition, Vector endPosition, int cheatLength)
{
    var allNodes = map.ExtractNodes();
    allNodes.Dijkstra(startPosition, out var distances, out _);

    List<Cheat> cheats = new();
    var initialStartEndDistance = distances[endPosition];

    for (int y = 1; y < map.Count - 1; y++)
    {
        for (int x = 1; x < map[y].Length - 1; x++)
        {
            var curr = new Vector(x, y);
            if (distances.ContainsKey(curr)) continue;
            foreach (var d in Vector.AllDirections)
            {
                var from = curr + d;
                if (map.GetAtPosition(from) == '#') continue;
                foreach (var de in Vector.AllDirections.Where(q => q != d).ToList())
                {
                    var exit = curr + de;
                    if (map.GetAtPosition(exit) == '#') continue;

                    // the -2 offset is due to the two steps to enter and exit the hole !
                    var distanceSaved = distances[from] - distances[exit] - 2;

                    if (distanceSaved >= nsSaved)
                    {
                        var cheat = new Cheat(from, exit);
                        if (!cheats.Contains(cheat))
                            cheats.Add(cheat);
                    }
                }
            }
        }
    }

    return cheats;
}

public static class UsefulExtensions
{
    public static void Dump(this IEnumerable<string> enumerable)
    {
        foreach (var item in enumerable) Console.WriteLine(item);
    }

    public static Vector FindSymbol(this List<string> map, char symbol)
    {
        for (int y = 0; y < map.Count; y++)
        {
            if (!map[y].Contains(symbol)) continue;

            var x = map[y].IndexOf(symbol, StringComparison.OrdinalIgnoreCase);
            return new Vector(x, y);
        }

        throw new InvalidOperationException($"Cannot find '{symbol}'");
    }

    public static char GetAtPosition(this List<string> map, Vector position) => map[position.Y][position.X];

    public static char SetAtPosition(this List<string> map, Vector position, char symbol)
    {
        var toReturn = map.GetAtPosition(position);

        map[position.Y] = map[position.Y].Substring(0, position.X) + symbol + map[position.Y].Substring(position.X + 1);

        return toReturn;
    }

    public static List<T> Clone<T>(this List<T> source)
    {
        return [.. source];
    }

    public static Dictionary<Vector, List<Arc>> ExtractNodes(this List<string> map)
    {
        Dictionary<Vector, List<Arc>> toReturn = new();

        for (var y = 0; y < map.Count; y++)
        {
            for (var x = 0; x < map[y].Length; x++)
            {
                var nodePosition = new Vector(x, y);
                if (map.GetAtPosition(nodePosition) == '#')
                    continue;

                var arcs = Vector.Directions
                    .Where(d => map.GetAtPosition(d.Value + nodePosition) != '#')
                    .Select(d =>
                    {
                        var destinationPosition = nodePosition + d.Value;
                        Vector destinationNode = destinationPosition;
                        var weigth = 1;

                        Arc arc = new(weigth, destinationNode);
                        return arc;
                    })
                    .ToList();

                Vector newNode = nodePosition;
                toReturn.Add(newNode, arcs);
            }
        }

        return toReturn;
    }

    /// <summary>
    /// Dijkstra docet
    /// </summary>
    /// <param name="start"></param>
    /// <param name="end"></param>
    /// <returns></returns>
    public static long FindShortcuts(
        this List<string> map,
        Vector start,
        Vector end,
        out Vector bestPathEndNode,
        out Dictionary<Vector, long> bestDistances,
        out Dictionary<Vector, Vector> bestPath
        )
    {
        var allNodes = map.ExtractNodes();

        // These are the arrival points (can be more than one if the destination can be reached from several directions)
        var endNodes = allNodes.Where(n => n.Key == end).ToList();
        var currentBest = long.MaxValue;

        bestDistances = new();
        bestPath = new();
        bestPathEndNode = endNodes.First().Key;

        var sw = Stopwatch.StartNew();
        Dictionary<Vector, long> distances;
        Dictionary<Vector, Vector> path;
        allNodes.Dijkstra(start, out distances, out path);
        sw.Stop();
        Console.WriteLine("Dijkstra mapping completed in " + sw.Elapsed);

        foreach (var endNode in endNodes)
        {
            if (!distances.ContainsKey(endNode.Key)) continue;
            if (distances[endNode.Key] < currentBest)
            {
                bestDistances = distances;
                bestPath = path;
                bestPathEndNode = endNode.Key;
                currentBest = distances[endNode.Key];
            }

            map.DrawPath(start, endNode, path);
            Console.WriteLine("Computed path for end: " + endNode + " cost: " + distances[endNode.Key]);
        }

        return currentBest;
    }

    public static void Dijkstra(this Dictionary<Vector, List<Arc>> allNodes, Vector start, out Dictionary<Vector, long> distances, out Dictionary<Vector, Vector> path)
    {
        // we must compute the shortest path for each end node, 
        Dictionary<Vector, List<Arc>> unvisited = new();
        foreach (var n in allNodes) unvisited.Add(n.Key, n.Value);

        Dictionary<Vector, List<Arc>> visited = new();
        distances = new();
        path = new();
        path.Add(start, start);
        distances.Add(start, 0);
        while (unvisited.Count() != 0 && distances.Where(kv => unvisited.ContainsKey(kv.Key)).Any())
        {
            var shortestDistanceNodeSoFar = distances.Where(kv => unvisited.ContainsKey(kv.Key)).OrderBy(kv => kv.Value).First();
            var currentNode = unvisited.Single(kv => kv.Key == shortestDistanceNodeSoFar.Key);
            // Console.WriteLine("Visiting node: " + currentNode.Key);
            visited.Add(currentNode.Key, currentNode.Value);
            unvisited.Remove(currentNode.Key);

            foreach (var arc in currentNode.Value.Where(d => unvisited.ContainsKey(d.Destination)))
            {
                var distance = distances[currentNode.Key] + arc.Weigth;
                if (!distances.ContainsKey(arc.Destination))
                    distances.Add(arc.Destination, long.MaxValue);

                if (distance < distances[arc.Destination])
                {
                    distances[arc.Destination] = distance;
                    path[arc.Destination] = currentNode.Key;
                }
            }
        }
    }

    private static void DrawPath(this List<string> map, Vector start, KeyValuePair<Vector, List<Arc>> endNode, Dictionary<Vector, Vector> path)
    {
        var mapClone = map.Clone();
        var currentNode = path.Where(kv => kv.Key == endNode.Key).First();
        while (currentNode.Key != start)
        {
            mapClone.SetAtPosition(currentNode.Value, 'O');
            currentNode = path.Where(kv => kv.Key == currentNode.Value).First();
        }
        mapClone.Dump();
    }
}

public record struct Arc(long Weigth, Vector Destination);

public readonly record struct Cheat(Vector Enter, Vector Exit);

public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);

    public static Vector North => new(0, -1);
    public static Vector East => new(1, 0);
    public static Vector South => -North;
    public static Vector West => -East;


    public static IEnumerable<Vector> AllDirections = [
        North,
        East,
        South,
        West
    ];

    public static Dictionary<char, Vector> Directions = new() {
        {'^', North},
        {'>', East},
        {'v', South},
        {'<', West},
    };
}