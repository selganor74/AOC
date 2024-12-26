using System.Diagnostics;
using System.Net.Http.Headers;

var inputContent = File.ReadAllLines("input.txt");

List<string> map = new();
List<string> commandsList = new();
var enumerator = inputContent.GetEnumerator();

ExtractMap(map, enumerator);

string commands = ExtractCommands(commandsList, enumerator);

map.Dump();
Console.WriteLine(commands);

var position = map.FindRobot();
Console.WriteLine("Robot starts at position" + position);

// Checks that the GetAt and SetAt are working as they should
Debug.Assert(map.GetAtPosition(position) == '@');
Debug.Assert(map.SetAtPosition(position, 'X') == '@');
Debug.Assert(map.GetAtPosition(position) == 'X');
Debug.Assert(map.SetAtPosition(position, '@') == 'X');

var robot = new Robot(position, map);
foreach (var command in commands)
{
    robot.ExecuteCommand(command);
    // map.Dump();
    // Console.ReadKey(true);
}

map.Dump();
var part1 = map.GetAllBoxesGPSCoord();
Console.WriteLine("Part1: " + part1);

// P A R T   2
inputContent = File.ReadAllLines("input.txt");

map = new();
commandsList = new();
enumerator = inputContent.GetEnumerator();

P2ExtractMap(map, enumerator);

commands = ExtractCommands(commandsList, enumerator);

map.Dump();
Console.WriteLine(commands);

position = map.FindRobot();
Console.WriteLine("Robot starts at position" + position);

var robotP2 = new P2Robot(position, map);
foreach (var command in commands)
{
    robotP2.ExecuteCommand(command);
    // map.Dump();
    // Console.ReadKey(true);
}

map.Dump();
var part2 = map.GetAllBoxesGPSCoord('[');
Console.WriteLine("Part2: " + part2);


static void ExtractMap(List<string> map, System.Collections.IEnumerator enumerator)
{
    enumerator.MoveNext();
    var row = (string)enumerator.Current;
    do
    {
        map.Add(row);

        if (!enumerator.MoveNext()) break;
        row = (string)enumerator.Current;
    } while (!string.IsNullOrEmpty(row));
}

static void P2ExtractMap(List<string> map, System.Collections.IEnumerator enumerator)
{
    enumerator.MoveNext();
    var row = (string)enumerator.Current;
    do
    {
        var toAdd = "";
        foreach (var symbol in row)
        {
            if (symbol == '#') toAdd += "##";
            if (symbol == '.') toAdd += "..";
            if (symbol == 'O') toAdd += "[]";
            if (symbol == '@') toAdd += "@.";
        }
        map.Add(toAdd);

        if (!enumerator.MoveNext()) break;
        row = (string)enumerator.Current;
    } while (!string.IsNullOrEmpty(row));
}

static string ExtractCommands(List<string> commandsList, System.Collections.IEnumerator enumerator)
{
    string row = "";
    do
    {
        commandsList.Add(row);

        if (!enumerator.MoveNext()) break;
        row = (string)enumerator.Current;
    } while (!string.IsNullOrEmpty(row));

    var commands = string.Join("", commandsList);
    return commands;
}

public class Robot(Vector position, List<string> map)
{
    public Vector Position { get; private set; } = position;
    public List<string> Map { get; } = map;

    private bool CanMove(Vector direction, Vector from)
    {
        var next = from + direction;
        var atPos = Map.GetAtPosition(next);

        if (atPos == '.') return true;
        if (atPos == 'O') return CanMove(direction, next);
        if (atPos == '#') return false;

        throw new InvalidOperationException($"Unknown map symbol '{atPos}'");
    }

    private void Move(Vector direction)
    {
        if (!CanMove(direction, Position))
            return;

        // find the first '.'
        var start = Position;
        var charAt = ' ';
        do
        {
            start += direction;
            charAt = Map.GetAtPosition(start);
        } while (charAt != '.');

        // then move backwards while swapping items
        do
        {
            var replaced = map.SetAtPosition(start, map.GetAtPosition(start - direction));
            map.SetAtPosition(start - direction, replaced);
            start -= direction;
        } while (start != Position);

        // finally set the new position
        Position += direction;
    }

    public void ExecuteCommand(char command)
    {
        var direction = Vector.CommandDirection[command];
        Move(direction);
    }
}

public class P2Robot(Vector position, List<string> map)
{
    public Vector Position { get; private set; } = position;
    public List<string> Map { get; } = map;

    private List<Vector> CanMove(Vector direction, Vector from)
    {
        var next = from + direction;
        var atPos = Map.GetAtPosition(next);

        if (atPos == '.') return [next];
        if (atPos == '#') return [];

        var col = CanMove(direction, next);

        if (direction == Vector.Left || direction == Vector.Right)
        {
            if (atPos == '[' || atPos == ']')
            {
                if (col.Count > 0)
                    return [next, .. col];

                return [];
            }
        }

        if (direction == Vector.Up || direction == Vector.Down)
        {
            if (atPos == '[')
            {
                var colR = CanMove(direction, next + Vector.Right);
                if (col.Count > 0 && colR.Count > 0) return [next, .. colR, .. col];
                return [];
            }
            if (atPos == ']')
            {
                var colL = CanMove(direction, next + Vector.Left);
                if (col.Count > 0 && colL.Count > 0) return [next, .. colL, .. col];
                return [];
            };
        }

        throw new InvalidOperationException($"Unexpected map symbol '{atPos}'");
    }

    private void Move(Vector direction)
    {
        var toBeMoved = CanMove(direction, Position);
        if (toBeMoved.Count == 0)
            return;

        // We MUST swap each position exactly once!
        toBeMoved = toBeMoved.Distinct().ToList();

        if (direction == Vector.Left || direction == Vector.Right)
        {
            toBeMoved = toBeMoved.OrderBy(p => p.X * -direction.X).ToList();
        }
        else
        {
            toBeMoved = toBeMoved.OrderBy(p => p.Y * -direction.Y).ToList();
        }

        // Console.WriteLine("To Be Moved:\n" + string.Join("\r\n", toBeMoved));
        
        foreach (var toSwap in toBeMoved)
        {
            // Console.WriteLine($"Swapping {toSwap} ({map.GetAtPosition(toSwap)}) with {toSwap-direction} ({Map.GetAtPosition(toSwap - direction)}) ");
            var replaced = map.SetAtPosition(toSwap, map.GetAtPosition(toSwap - direction));
            map.SetAtPosition(toSwap - direction, replaced);
        }

        // finally set the new position
        Position += direction;
    }

    public void ExecuteCommand(char command)
    {
        var direction = Vector.CommandDirection[command];
        Move(direction);
    }
}

public static class EnumerableOfStringExtensions
{
    public static void Dump(this IEnumerable<string> enumerable)
    {
        foreach (var item in enumerable) Console.WriteLine(item);
    }

    public static Vector FindRobot(this List<string> map)
    {
        for (int y = 0; y < map.Count; y++)
        {
            if (!map[y].Contains('@')) continue;

            var x = map[y].IndexOf('@', StringComparison.OrdinalIgnoreCase);
            return new Vector(x, y);
        }

        throw new InvalidOperationException("Cannot find robot!");
    }

    public static char GetAtPosition(this List<string> map, Vector position) => map[position.Y][position.X];

    public static char SetAtPosition(this List<string> map, Vector position, char symbol)
    {
        var toReturn = map.GetAtPosition(position);

        map[position.Y] = map[position.Y].Substring(0, position.X) + symbol + map[position.Y].Substring(position.X + 1);

        return toReturn;
    }

    public static long GetAllBoxesGPSCoord(this List<string> map, char toFind = 'O')
    {
        long toReturn = 0;
        for (int y = 0; y < map.Count; y++)
            for (int x = 0; x < map[y].Length; x++)
            {
                var pos = new Vector(x, y);
                if (map.GetAtPosition(pos) == toFind)
                    toReturn += pos.AsGpsCoord();
            }

        return toReturn;
    }
}

public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);

    public static Vector Up => new(0, -1);
    public static Vector Right => new(1, 0);
    public static Vector Down => -Up;
    public static Vector Left => -Right;

    public static Dictionary<char, Vector> CommandDirection = new() {
        {'^', Up},
        {'>', Right},
        {'v', Down},
        {'<', Left},
    };

    public long AsGpsCoord()
    {
        return 100 * Y + X;
    }
}