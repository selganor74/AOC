/* TESTING
Robot.Size = new Vector(11 - 1, 7 - 1);
var totSeconds = 100;
var robotInfo = File.ReadAllLines("test.txt");
//*/

/*            
            1
  12345678901

   01234567890
1 0     |
2 1     |
3 2     |
4 3-----+-----
5 4     |
6 5     |
7 6     |

0: p=3,1 v=-3,-2
1: p=[3-3=0],[1-2=-1+6+1=6]

*/


//* FULL Input
using System.Numerics;

Robot.Size = new Vector(101 - 1, 103 - 1);
var totSeconds = 100;
var robotInfo = File.ReadAllLines("input.txt");
//*/

var robots = robotInfo
    .Select(x =>
        {
            var posString = x.Split(' ')[0];
            var velString = x.Split(' ')[1];
            var pos = Vector.FromString(posString);
            var vel = Vector.FromString(velString);
            return new Robot(pos, vel);
        })
    .ToList();

for (int seconds = 1; seconds <= totSeconds; seconds++)
{
    foreach (var robot in robots)
    {
        robot.Move();
    }
}

var part1 = 1;
var robotsInQ1 = robots
    .GroupBy(r => r.Quadrant())
    .Where(g => g.Key > 0)
    .Select(g => { part1 *= g.Count(); return g; })
    .ToList();
    
Console.WriteLine("Part1: " + part1);


int p2seconds = 100;
bool foundTree = false;
do
{
    // Console.ReadKey(true);
    foreach (var robot in robots)
    {
        robot.Move();
    }
    p2seconds++;
    foreach(var robot in robots) {
        if(robots.Any(r => r.Position == robot.Position + new Vector(-1,1))
            && robots.Any(r => r.Position == robot.Position + new Vector(0,1))
            && robots.Any(r => r.Position == robot.Position + new Vector(1,1))
            && robots.Any(r => r.Position == robot.Position + new Vector(-2,2))
            && robots.Any(r => r.Position == robot.Position + new Vector(-1,2))
            && robots.Any(r => r.Position == robot.Position + new Vector(0,2))
            && robots.Any(r => r.Position == robot.Position + new Vector(1,2))
            && robots.Any(r => r.Position == robot.Position + new Vector(2,2))
        ){
            foundTree = true;
        }
    }
    // Console.Clear();
    //robots.DrawMap();
} while(!foundTree);
robots.DrawMap();
Console.WriteLine("Part2: " + p2seconds);

public class Robot
{
    public static Vector Size = new(0, 0);
    public static Rectangle Q1 => new Rectangle(new(0, 0), new(Size.X / 2 - 1, Size.Y / 2 - 1));
    public static Rectangle Q2 => new Rectangle(new Vector(Size.X / 2 + 1, 0), new Vector(Size.X, Size.Y / 2 - 1));
    public static Rectangle Q3 => new Rectangle(new Vector(0, Size.Y / 2 + 1), new Vector(Size.X / 2 - 1, Size.Y));
    public static Rectangle Q4 => new Rectangle(new Vector(Size.X / 2 + 1, Size.Y / 2 + 1), new Vector(Size.X, Size.Y));

    public Vector Position { get; private set; }
    public readonly Vector Velocity;

    public char Id { get; private set; } = ' ';
    public static int NextIdIndex = 0;
    public static readonly string AllIds = "abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789!£$%&/()=?^*§°Ç-;:";

    public Robot(Vector position, Vector velocity)
    {
        Position = position;
        Velocity = velocity;

        Id = AllIds[NextIdIndex];
        NextIdIndex++;
        if (NextIdIndex >= AllIds.Length) NextIdIndex = 0;
    }

    public int Quadrant()
    {
        if (Q1.Contains(Position)) return 1;
        if (Q2.Contains(Position)) return 2;
        if (Q3.Contains(Position)) return 3;
        if (Q4.Contains(Position)) return 4;
        return 0;
    }

    public void Move()
    {
        var newPos = Velocity + Position;
        if (newPos.X < 0) newPos = new(newPos.X + Size.X + 1, newPos.Y);
        if (newPos.Y < 0) newPos = new(newPos.X, newPos.Y + Size.Y + 1);
        if (newPos.X > Size.X) newPos = new(newPos.X - (Size.X + 1), newPos.Y);
        if (newPos.Y > Size.Y) newPos = new(newPos.X, newPos.Y - (Size.Y + 1));
        Position = newPos;
    }

    internal void Dump()
    {
        Console.WriteLine($"[{Id}] Quadrant: {Quadrant()} Position: {Position}, Velocity: {Velocity}");
    }
}

public readonly record struct Rectangle(Vector TopLeft, Vector BottomRight)
{
    public bool Contains(Vector v1)
    {
        return v1.X >= TopLeft.X && v1.X <= BottomRight.X && v1.Y >= TopLeft.Y && v1.Y <= BottomRight.Y;
    }
}

public readonly record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector v1) => v1;
    public static Vector operator -(Vector v1) => new(-v1.X, -v1.Y);
    public static Vector operator +(Vector v1, Vector v2) => new(v1.X + v2.X, v1.Y + v2.Y);
    public static Vector operator -(Vector v1, Vector v2) => v1 + (-v2);
    public static Vector operator %(Vector v1, Vector v2) => new(v1.X % v2.X, v1.Y % v2.Y);
    public static Vector operator /(Vector v1, int v2) => new(v1.X / v2, v1.Y / v2);


    public static Vector Up => new(0, -1);
    public static Vector Right => new(1, 0);
    public static Vector Down => -Up;
    public static Vector Left => -Right;

    public static Vector FromString(string str)
    {
        var coords = str.Split('=')[1].Split(',').Select(int.Parse).ToArray();
        return new Vector(coords[0], coords[1]);
    }

}

public static class MapExtensions
{
    public static void DrawMap(this List<Robot> robots)
    {
        var map = new List<string>();
        for (int y = 0; y <= Robot.Size.Y; y++)
        {
            var toAdd = "";
            for (int x = 0; x <= Robot.Size.X; x++)
            {
                toAdd += " ";
            }
            map.Add(toAdd);
        }
        foreach (var r in robots)
        {
            var x = r.Position.X;
            map[r.Position.Y] = map[r.Position.Y].Substring(0, r.Position.X) + r.Id + map[r.Position.Y].Substring(r.Position.X + 1);
        }
        map.ForEach(Console.WriteLine);
        // robots.ForEach(r => r.Dump());
    }
}