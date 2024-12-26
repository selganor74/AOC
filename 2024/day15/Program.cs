using System.Diagnostics;

var inputContent = File.ReadAllLines("input.txt");

List<string> map = new();
List<string> commandsList = new();
var enumerator = inputContent.GetEnumerator();

string row = ExtractMap(map, enumerator);

string commands = ExtractCommands(commandsList, enumerator, ref row);

map.Dump();
Console.WriteLine(commands);

var position = map.FindRobot();
Console.WriteLine(position);

Debug.Assert(map.GetAtPosition(position) == '@');
Debug.Assert(map.SetAtPosition(position, 'X') == '@');
Debug.Assert(map.GetAtPosition(position) == 'X');
Debug.Assert(map.SetAtPosition(position, '@') == 'X');

var robot = new Robot(position, map);
foreach (var command in commands)
{
    robot.ExecuteCommand(command);
    // Console.Clear();
    //Console.WriteLine("Command Executed: " + command);
    //Console.ReadKey(true);
}

map.Dump();
var part1 = map.GetAllBoxesGPSCoord();
Console.WriteLine("Part1: " + part1);

static string ExtractMap(List<string> map, System.Collections.IEnumerator enumerator)
{
    enumerator.MoveNext();
    var row = (string)enumerator.Current;
    do
    {
        map.Add(row);

        if (!enumerator.MoveNext()) break;
        row = (string)enumerator.Current;
    } while (!string.IsNullOrEmpty(row));
    return row;
}

static string ExtractCommands(List<string> commandsList, System.Collections.IEnumerator enumerator, ref string row)
{
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

    public static long GetAllBoxesGPSCoord(this List<string> map)
    {
        long toReturn = 0;
        for(int y = 0; y < map.Count; y++)
            for(int x = 0; x < map[y].Length; x++) {
                var pos = new Vector(x,y);
                if(map.GetAtPosition(pos) == 'O')
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

    public long AsGpsCoord(){
        return 100*Y + X;
    }
}