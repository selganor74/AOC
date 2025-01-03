using System.Diagnostics;

var map = File.ReadAllLines("input.txt").ToList();

map.Dump();

var startPosition = map.FindSymbol('S');
var startDirection = Vector.Directions['>'];
var startNode = new Node(startPosition, startDirection);
var endPosition = map.FindSymbol('E');

var part1 = map.FindLessCostPath(startNode, endPosition);
Console.WriteLine("Part 1: " + part1);
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
                var exitingDirections = Vector.Directions.Where(d => map.GetAtPosition(d.Value + nodePosition) != '#' || map.GetAtPosition(nodePosition) == 'S').ToList();
                foreach (var exit in exitingDirections)
                {
                    /* each exit produces a node for every other exit 
                    
                        <->O<->
                           ^
                           |
                           V 
                    */

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
    public static long FindLessCostPath(this List<string> map, Node start, Vector end)
    {
        List<long> costs = new();
        var allNodes = map.ExtractNodes();

        // These are the arrival points (can be more than one if the destination an be reached from several directions)
        var endNodes = allNodes.Where(n => n.Key.Position == end).ToList();
        foreach (var endNode in endNodes)
        {
            var sw = Stopwatch.StartNew();
            // we must compute the shortest path for each end node, 
            Dictionary<Node, List<Arc>> unvisited = new();
            foreach (var n in allNodes) unvisited.Add(n.Key, n.Value);

            Dictionary<Node, List<Arc>> visited = new();
            Dictionary<Node, long> distances = new();
            Dictionary<Node, Node> path = new();

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
            sw.Stop();
            Console.WriteLine("Computed path for end: " + endNode + " cost: " + distances[endNode.Key] + " in " + sw.Elapsed);
            costs.Add(distances[endNode.Key]);
        }
        return costs.Min();
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