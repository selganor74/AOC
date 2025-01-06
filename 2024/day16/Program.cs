using System.Diagnostics;

var map = File.ReadAllLines("input.txt").ToList();

map.Dump();

var startPosition = map.FindSymbol('S');
var startDirection = Vector.Directions['>'];
var startNode = new Node(startPosition, startDirection);
var endPosition = map.FindSymbol('E');

var part1 = map.FindLeastCostPath(startNode, endPosition, out var bestPathEndNode, out var bestDistances, out var bestPath);
Console.WriteLine("Part 1: " + part1);

var allNodes = map.ExtractNodes();
var candidates = allNodes; //.Where(n => bestDistances.Any(kv => kv.Key == n.Key && kv.Value < part1)).ToDictionary();
Console.WriteLine("Checking distance for " + candidates.Count + " nodes.");
candidates.Dijkstra(bestPathEndNode, out var distancesToEnd, out _);
List<Vector> bestPathsCells = new();

var minDistancesFromEnd = distancesToEnd.GroupBy(dte => dte.Key.Position).Select(g => KeyValuePair.Create(g.Key, g.Select(gc => gc.Value).Min())).ToDictionary();
var minDistancesFromStart = bestDistances.GroupBy(dte => dte.Key.Position).Select(g => KeyValuePair.Create(g.Key, g.Select(gc => gc.Value).Min())).ToDictionary();

foreach (var distanceFromEnd in minDistancesFromEnd)
{
    var totDistance = distanceFromEnd.Value + minDistancesFromStart[distanceFromEnd.Key];
    if (distanceFromEnd.Value < part1 || minDistancesFromStart[distanceFromEnd.Key] < part1)
        Console.WriteLine("Position: " + distanceFromEnd.Key + " " + totDistance + " (" + distanceFromEnd.Value + " + " + minDistancesFromStart[distanceFromEnd.Key] + " )");
    
    if (totDistance > part1) 
        continue;
    
    if (!bestPathsCells.Contains(distanceFromEnd.Key))
        bestPathsCells.Add(distanceFromEnd.Key);
}

var part2 = bestPathsCells.Count;
Console.WriteLine("Part 2: " + part2);


// BruteForceSolution(map);

static void BruteForceSolution(List<string> map)
{
    List<MazeSnapshot> mazeStack = new();
    List<MazeSolver> solutions = new();

    var startingMaze = new MazeSolver(map, [new Move(map.FindSymbol('S'), Vector.East, 0)]);
    var currentMazeSnapshot = new MazeSnapshot(startingMaze, startingMaze.GetAvailableMoves());

    mazeStack.Add(currentMazeSnapshot);

    long totalTrials = 0;
    var firstSolutionFound = false;
    long leastPath = long.MaxValue;

    do
    {
        totalTrials++;

        if (currentMazeSnapshot.MovesLeft.Count == 0)
        {
            mazeStack.Remove(currentMazeSnapshot);
            // Console.WriteLine("Current Depth (-): " + mazeStack.Count);
            if (mazeStack.Count == 0)
            {
                // throw new InvalidOperationException("Unable to find a solution!");
                break;
            }
            currentMazeSnapshot = mazeStack.Last();
            continue;
        }

        var nextStep = currentMazeSnapshot.MovesLeft.Last();
        currentMazeSnapshot.MovesLeft.Remove(nextStep);

        var newMaze = currentMazeSnapshot.Maze.ApplyMove(nextStep);

        if (totalTrials % 1000 == 0)
        {
            newMaze.DrawPath();
            //Console.WriteLine("Drawn ... press a key");
            //Console.ReadKey(true);
        }


        if (newMaze.GetPathPoints() >= leastPath)
            continue;

        if (firstSolutionFound)
        {
            // newMaze.DrawPath();
            //Console.WriteLine("Drawn ... press a key");
            //Console.ReadKey(true);
        }

        if (newMaze.IsSolved())
        {
            firstSolutionFound = true;
            var pathPoints = newMaze.GetPathPoints();
            if (pathPoints < leastPath)
            {
                solutions.Add(newMaze);
                newMaze.DrawPath();
                Console.WriteLine("shorter solution found: " + pathPoints + " (wins against " + leastPath + ") ");
                leastPath = pathPoints;

                // start from scratch but with a new "record" set
                mazeStack = new();

                var startingPlace = map.FindSymbol('S');
                startingMaze = new MazeSolver(map, [new Move(startingPlace, Vector.East, 0)]);
                currentMazeSnapshot = new MazeSnapshot(startingMaze, startingMaze.GetAvailableMoves());

                mazeStack.Add(currentMazeSnapshot);
            }
        }
        else
        {
            currentMazeSnapshot = new(newMaze, newMaze.GetAvailableMoves());
            mazeStack.Add(currentMazeSnapshot);
            // Console.WriteLine("Current Depth (+): " + mazeStack.Count);
        }


    } while (true);
    var part1 = solutions.OrderBy(s => s.GetPathPoints()).First().GetPathPoints();
    Console.WriteLine($"Part1: " + part1);
}

public readonly record struct MazeSnapshot(MazeSolver Maze, List<Move> MovesLeft);

public class MazeSolver
{
    private readonly List<Move> stepsSoFar;
    public List<Move> StepsSoFar => [.. stepsSoFar];
    private readonly List<string> map;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="map"></param>
    /// <param name="stepsSoFar">The last item of stepsSoFar is the current position</param>
    public MazeSolver(List<string> map, List<Move> stepsSoFar)
    {
        this.stepsSoFar = stepsSoFar;
        this.map = map;
    }

    public List<Move> GetAvailableMoves()
    {
        var currentPosition = stepsSoFar.Last();
        List<Move> toReturn = new();
        foreach (var d in Vector.Directions)
        {
            var direction = d.Value;
            var next = currentPosition.Destination + direction;
            var symbol = map.GetAtPosition(next);
            if (symbol == '#') continue; // going through an obstacle
            if (stepsSoFar.Any(s => s.Destination == next)) continue; // it's an already visited cell

            if (direction == currentPosition.Direction)
            {
                toReturn.Add(new Move(next, direction, 1));
                continue;
            }

            if (direction == -currentPosition.Direction)
            {
                toReturn.Add(new Move(next, direction, 1 + 2000));
                continue;
            }

            toReturn.Add(new Move(next, direction, 1 + 1000));
        }

        return toReturn;
    }

    public void DrawPath()
    {
        var toDisplay = map.Clone();

        foreach (var s in stepsSoFar)
        {
            var symbol = Vector.Directions.Where(d => d.Value == s.Direction).Select(d => d.Key).Single();
            toDisplay.SetAtPosition(s.Destination, symbol);
        }
        toDisplay.Dump();
    }

    public bool IsSolved()
    {
        var currentPosition = stepsSoFar.Last();
        var symbol = map.GetAtPosition(currentPosition.Destination);
        return symbol == 'E';
    }

    public long GetPathPoints()
    {
        return stepsSoFar.Select(s => s.Points).Sum();
    }

    public MazeSolver ApplyMove(Move move)
    {
        return new MazeSolver(map, [.. stepsSoFar, move]);
    }
}

public readonly record struct Move(Vector Destination, Vector Direction, int Points);

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
                            map.GetAtPosition(d.Value + nodePosition) != '#'
                        || map.GetAtPosition(nodePosition) == 'S'
                        || map.GetAtPosition(nodePosition) == 'E'
                    )
                    .ToList();

                foreach (var exit in exitingDirections)
                {
                    var enteringDirection = -exit.Value;

                    var arcs = exitingDirections
                        .Where(d => map.GetAtPosition(d.Value + nodePosition) != '#')
                        .Where(d => d.Value != exit.Value)
                        .Select(d =>
                        {
                            var destinationPosition = nodePosition + d.Value;
                            Node destinationNode = new(destinationPosition, d.Value);
                            var weigth = 0;
                            if (enteringDirection != d.Value)
                                weigth = 1001;
                            if (enteringDirection == d.Value)
                                weigth = 1;
                            if (enteringDirection == -d.Value) // Should never happen!
                                weigth = 2001;

                            Debug.Assert(weigth != 0);

                            Arc arc = new(weigth, destinationNode);
                            return arc;
                        })
                        .ToList();

                    Node newNode = new(nodePosition, enteringDirection);
                    toReturn.Add(newNode, arcs);
                }
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

            map.DrawPath(start, endNode, path);
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

    private static void DrawPath(this List<string> map, Node start, KeyValuePair<Node, List<Arc>> endNode, Dictionary<Node, Node> path)
    {
        var mapClone = map.Clone();
        var currentNode = path.Where(kv => kv.Key == endNode.Key).First();
        while (currentNode.Key != start)
        {
            var directionChar = Vector.Directions.Where(d => d.Value == currentNode.Value.EnteringDirection).Select(d => d.Key).Single();
            mapClone.SetAtPosition(currentNode.Value.Position, directionChar);
            currentNode = path.Where(kv => kv.Key == currentNode.Value).First();
        }
        mapClone.Dump();
    }
}

public record struct Arc(long Weigth, Node Destination);

public record struct Node(Vector Position, Vector EnteringDirection);

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

    public static Dictionary<char, Vector> Directions = new() {
        {'^', North},
        {'>', East},
        {'v', South},
        {'<', West},
    };
}