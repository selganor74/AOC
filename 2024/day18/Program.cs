using System.Diagnostics;

/* Test Input Setup
var input = File.ReadAllLines("test.txt");
var mapSize = new Vector(6, 6);
var numCorrupted = 12;
//*/
//* Official Input Setup
var input = File.ReadAllLines("input.txt");
var mapSize = new Vector(70, 70);
var numCorrupted = 1024;
//*/

List<string> map = new();
for (int y = 0; y <= mapSize.Y; y++)
{
    map.Add("".PadRight(mapSize.X + 1, '.'));
}

for (int i = 0; i < numCorrupted; i++)
    map.SetAtPosition(Vector.FromString(input[i]), '#');


Node startNode = new(new(0, 0));
Node endNode = new(mapSize);
var nodes = map.ExtractNodes();
nodes.Dijkstra(startNode, out var distances, out var path);
var lastPath = map.DrawPath(startNode, new(mapSize), path);
var part1 = distances[new(mapSize)];
Console.WriteLine("Part1: " + part1);

int nextFalling = numCorrupted;
Vector corruptionPosition;
do
{
    nextFalling++;
    corruptionPosition = Vector.FromString(input[nextFalling]);

    map.SetAtPosition(corruptionPosition, '#');
    nodes.Remove(new(corruptionPosition));
    foreach (var v in Vector.Directions)
    {
        var toCheck = corruptionPosition + v.Value;
        if (!map.IsContainedInMap(toCheck)) continue;
        try
        {
            nodes[new(toCheck)].Remove(new Arc(1, new(toCheck)));
        }
        catch { }
    }

    if (lastPath.GetAtPosition(corruptionPosition) != 'O')
        continue;

    nodes.Dijkstra(startNode, out distances, out path);

    if (distances.ContainsKey(endNode))
        lastPath = map.DrawPath(startNode, endNode, path);

    Console.WriteLine("Processed corruption #:" + nextFalling);
} while (distances.ContainsKey(endNode));

var part2 = corruptionPosition;
// map.DrawPath(startNode, new(part2), path);
Console.WriteLine("Part1: " + part1);
Console.WriteLine($"Part2: {part2.X},{part2.Y}");

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

    public static bool IsContainedInMap(this List<string> map, Vector toCheck)
    {
        return toCheck.X >= 0 && toCheck.Y >= 0 && toCheck.Y < map.Count && toCheck.X < map[toCheck.Y].Length;
    }

    public static Dictionary<Node, List<Arc>> ExtractNodes(this List<string> map)
    {
        Dictionary<Node, List<Arc>> toReturn = new();

        for (var y = 0; y < map.Count; y++)
        {
            for (var x = 0; x < map[y].Length; x++)
            {
                var nodePosition = new Vector(x, y);
                if (map.GetAtPosition(nodePosition) == '#')
                    continue;

                // extracts all the directions that this node can exit to.
                // We have a special case for the start position, where we have all entering directions possible. ---------------------------------------V
                var exitingDirections = Vector.Directions
                    .Where(d =>
                    {

                        var toCheck = d.Value + nodePosition;

                        return map.IsContainedInMap(toCheck)
                            && map.GetAtPosition(toCheck) != '#';
                    }
                    )
                    .ToList();

                var arcs = exitingDirections
                    .Where(d => map.GetAtPosition(d.Value + nodePosition) != '#')
                    .Select(d =>
                    {
                        var destinationPosition = nodePosition + d.Value;
                        Node destinationNode = new(destinationPosition);

                        var weigth = 1;
                        Arc arc = new(weigth, destinationNode);
                        return arc;
                    })
                    .ToList();

                Node newNode = new(nodePosition);
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
    public static long FindLeastCostPath(
        this List<string> map,
        Node start,
        Vector end,
        out Node bestPathEndNode,
        out Dictionary<Node, long> bestDistances,
        out Dictionary<Node, Node> bestPath
        )
    {
        var allNodes = map.ExtractNodes();

        // These are the arrival points (can be more than one if the destination can be reached from several directions)
        var endNodes = allNodes.Where(n => n.Key.Position == end).ToList();
        var currentBest = long.MaxValue;

        bestDistances = new();
        bestPath = new();
        bestPathEndNode = endNodes.First().Key;

        var sw = Stopwatch.StartNew();
        Dictionary<Node, long> distances;
        Dictionary<Node, Node> path;
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

            map.DrawPath(start, endNode.Key, path);
            Console.WriteLine("Computed path for end: " + endNode + " cost: " + distances[endNode.Key]);
        }

        return currentBest;
    }

    public static void Dijkstra(this Dictionary<Node, List<Arc>> allNodes, Node start, out Dictionary<Node, long> distances, out Dictionary<Node, Node> path)
    {
        // we must compute the shortest path for each end node, 
        Dictionary<Node, List<Arc>> unvisited = new();
        foreach (var n in allNodes) unvisited.Add(n.Key, n.Value);

        Dictionary<Node, List<Arc>> visited = new();
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

    public static List<string> DrawPath(this List<string> map, Node start, Node endNode, Dictionary<Node, Node> path)
    {
        var mapClone = map.Clone();
        var currentNode = path.Where(kv => kv.Key == endNode).First();
        while (currentNode.Key != start)
        {
            var directionChar = 'O';
            mapClone.SetAtPosition(currentNode.Value.Position, directionChar);
            currentNode = path.Where(kv => kv.Key == currentNode.Value).First();
        }
        mapClone.Dump();
        return mapClone;
    }
}

public record struct Arc(long Weigth, Node Destination);

public record struct Node(Vector Position);


public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);

    public static Vector FromString(string inputCoordTuple)
    {
        var split = inputCoordTuple.Split(',').Select(c => int.Parse(c)).ToArray();
        return new Vector(split[0], split[1]);
    }

    public static Vector North => new(0, -1);
    public static Vector East => new(1, 0);
    public static Vector South => -North;
    public static Vector West => -East;

    public static Dictionary<char, Vector> Directions = new() {
        {'^', North},
        {'>', East},
        {'v', South},
        {'<', West},
    };
}