using System.Diagnostics;

var codes = File.ReadAllLines("test.txt");

/*

        +---+---+---+
        | 7 | 8 | 9 |
        +---+---+---+
        | 4 | 5 | 6 |
        +---+---+---+
        | 1 | 2 | 3 |
        +---+---+---+
            | 0 | A |
            +---+---+

            +---+---+
            | ^ | A |
        +---+---+---+
        | < | v | > |
        +---+---+---+

*/

Dictionary<char, Vector> keypadMap = new() {
    {'7', new(0,0)},
    {'8', new(1,0)},
    {'9', new(2,0)},
    {'4', new(0,1)},
    {'5', new(1,1)},
    {'6', new(2,1)},
    {'1', new(0,2)},
    {'2', new(1,2)},
    {'3', new(2,2)},
    {'0', new(1,3)},
    {'A', new(2,3)},
};

Dictionary<char, Vector> remoteControlMap = new() {
   {'^', new(1,0)},
   {'A', new(2,0)},
   {'<', new(0,1)},
   {'v', new(1,1)},
   {'>', new(2,1)},
};

// Debug.Assert(int.Parse("029") == 29);

var me = new RemoteControl(remoteControlMap, "me");
var robot1 = new RemoteControl(remoteControlMap, "robot 1", me);
var robot2 = new RemoteControl(remoteControlMap, "robot 2", robot1);
var keypad = new Keypad(keypadMap, "the keypad", robot2);

Action<char> onKeyPressed = (k) =>
{
    me.Dump();
    robot1.Dump();
    robot2.Dump();
    keypad.Dump();

    Console.WriteLine("--------");
    Console.ReadKey(true);
};

me.OnKeyPressed = onKeyPressed;
keypad.OnKeyPressed = onKeyPressed;
robot1.OnKeyPressed = onKeyPressed;
robot2.OnKeyPressed = onKeyPressed;
keypad.OnKeyPressed = onKeyPressed;

var part1 = 0;
foreach (var code in codes)
{
    var steps = keypad.TypeCode(code);
    var codePartial = int.Parse(code.Replace("A", "")) * steps;
    Console.WriteLine(code + ": " + steps + " partial: " + codePartial);
    Console.WriteLine("Press a key to continue");
    Console.ReadKey(true);
    part1 += codePartial;
}

Console.WriteLine(part1);

public class Keypad(Dictionary<char, Vector> kmap, string name, RemoteControl remoteControl)
{
    public Action<char> OnKeyPressed = (c) => { };
    private readonly Dictionary<char, Vector> kmap = kmap;
    public readonly string name = name;
    private readonly RemoteControl remoteControl = remoteControl;
    private char currPos = 'A';

    public int TypeCode(string code)
    {
        var keyPressed = new List<KeyPressed>();

        foreach (var k in code)
            TypeKey(k, remoteControl, keyPressed);

        Console.WriteLine(string.Join(Environment.NewLine, keyPressed));
        return keyPressed.Where(kp => kp.Who == "me").ToList().Count;
    }

    private void TypeKey(char key, RemoteControl usingRemote, List<KeyPressed> keyPressed)
    {
        var destination = kmap.KeyPosition(key);
        var currPosVector = kmap.KeyPosition(currPos);
        var pathVector = destination - currPosVector;

        var hDirectionKey = '>';
        if (Math.Sign(pathVector.X) == -1)
            hDirectionKey = '<';

        var vDirectionKey = 'v';
        if (Math.Sign(pathVector.Y) == -1)
            vDirectionKey = '^';

        Debug.Assert(destination != new Vector(0, 3));
        Debug.Assert(destination.X >= 0 && destination.X <= 2 && destination.Y >= 0 && destination.Y <= 3);

        if (destination.X == 0 || destination.Y == 3)
        {
            // we are "passing" by the missing cell
            if (destination.X == 0)
            {
                for (int y = 0; y < Math.Abs(pathVector.Y); y++)
                {
                    usingRemote.TypeKey(vDirectionKey, keyPressed);
                    currPosVector += new Vector(0, Math.Sign(pathVector.Y));
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }

                for (int x = 0; x < Math.Abs(pathVector.X); x++)
                {
                    usingRemote.TypeKey(hDirectionKey, keyPressed);
                    currPosVector += new Vector(Math.Sign(pathVector.X), 0);
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }
            }
            else
            {
                for (int x = 0; x < Math.Abs(pathVector.X); x++)
                {
                    usingRemote.TypeKey(hDirectionKey, keyPressed);
                    currPosVector += new Vector(Math.Sign(pathVector.X), 0);
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }

                for (int y = 0; y < Math.Abs(pathVector.Y); y++)
                {
                    usingRemote.TypeKey(vDirectionKey, keyPressed);
                    currPosVector += new Vector(0, Math.Sign(pathVector.Y));
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }
            }
        }
        else
        {
            for (int x = 0; x < Math.Abs(pathVector.X); x++)
            {
                usingRemote.TypeKey(hDirectionKey, keyPressed);
                currPosVector += new Vector(Math.Sign(pathVector.X), 0);
                currPos = kmap.KeyAtPosition(currPosVector);
                OnKeyPressed(key);
            }

            for (int y = 0; y < Math.Abs(pathVector.Y); y++)
            {
                usingRemote.TypeKey(vDirectionKey, keyPressed);
                currPosVector += new Vector(0, Math.Sign(pathVector.Y));
                currPos = kmap.KeyAtPosition(currPosVector);
                OnKeyPressed(key);
            }
        }

        usingRemote.TypeKey('A', keyPressed);

        currPos = key;

        keyPressed.Add(new(name, key));

        OnKeyPressed(key);
    }

    internal void Dump()
    {
        var keypad = $"""
        
        +---+---+---+
        | 7 | 8 | 9 |
        +---+---+---+
        | 4 | 5 | 6 |
        +---+---+---+
        | 1 | 2 | 3 |
        +---+---+---+
            | 0 | A |
            +---+---+
        
        """;
        Console.WriteLine(keypad.Replace(currPos.ToString(), "🖠"));
    }
}


public class RemoteControl(Dictionary<char, Vector> kmap, string Name, RemoteControl? usingRemote = null)
{
    public Action<char> OnKeyPressed = (c) => { };
    private readonly Dictionary<char, Vector> kmap = kmap;
    public readonly string Name = Name;
    private readonly RemoteControl? usingRemote = usingRemote;
    private char currPos = 'A';

    public void TypeKey(char key, List<KeyPressed> keyPressed)
    {
        if (usingRemote is null)
        {
            keyPressed.Add(new(Name, key));
            currPos = key;
            OnKeyPressed(key);
            return;
        }

        var destination = kmap.KeyPosition(key);
        var currPosVector = kmap.KeyPosition(currPos);
        var pathVector = destination - currPosVector;

        var hDirectionKey = '>';
        if (Math.Sign(pathVector.X) == -1)
            hDirectionKey = '<';

        var vDirectionKey = 'v';
        if (Math.Sign(pathVector.Y) == -1)
            vDirectionKey = '^';

        Debug.Assert(destination != new Vector(0, 0));
        Debug.Assert(destination.X >= 0 && destination.X <= 2 && destination.Y >= 0 && destination.Y <= 1);

        if (destination.X == 0 || destination.Y == 0)
        {
            // we are "passing" by the missing cell
            if (destination.X == 0)
            {
                for (int y = 0; y < Math.Abs(pathVector.Y); y++)
                {
                    usingRemote.TypeKey(vDirectionKey, keyPressed);
                    currPosVector += new Vector(0, Math.Sign(pathVector.Y));
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }

                for (int x = 0; x < Math.Abs(pathVector.X); x++)
                {
                    usingRemote.TypeKey(hDirectionKey, keyPressed);
                    currPosVector += new Vector(Math.Sign(pathVector.X), 0);
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }
            }
            else
            {
                for (int x = 0; x < Math.Abs(pathVector.X); x++)
                {
                    usingRemote.TypeKey(hDirectionKey, keyPressed);
                    currPosVector += new Vector(Math.Sign(pathVector.X), 0);
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }

                for (int y = 0; y < Math.Abs(pathVector.Y); y++)
                {
                    usingRemote.TypeKey(vDirectionKey, keyPressed);
                    currPosVector += new Vector(0, Math.Sign(pathVector.Y));
                    currPos = kmap.KeyAtPosition(currPosVector);
                    OnKeyPressed(key);
                }
            }
        }
        else
        {
            for (int x = 0; x < Math.Abs(pathVector.X); x++)
            {
                usingRemote.TypeKey(hDirectionKey, keyPressed);
                currPosVector += new Vector(Math.Sign(pathVector.X), 0);
                currPos = kmap.KeyAtPosition(currPosVector);
                OnKeyPressed(key);
            }

            for (int y = 0; y < Math.Abs(pathVector.Y); y++)
            {
                usingRemote.TypeKey(vDirectionKey, keyPressed);
                currPosVector += new Vector(0, Math.Sign(pathVector.Y));
                currPos = kmap.KeyAtPosition(currPosVector);
                OnKeyPressed(key);
            }
        }


        usingRemote.TypeKey('A', keyPressed);

        keyPressed.Add(new(Name, key));

        currPos = key;

        OnKeyPressed(key);
    }

    internal void Dump()
    {
        string remote = $"""

            +---+---+
            | ^ | A |
        +---+---+---+
        | < | v | > |
        +---+---+---+        
        
        """;
        Console.WriteLine(remote.Replace(currPos.ToString(), "🖠"));
    }
}

public record struct KeyPressed(string Who, char Key);


public static class UsefulExtensions
{
    public static Vector KeyPosition(this Dictionary<char, Vector> kMap, char key) => kMap[key];

    public static char KeyAtPosition(this Dictionary<char, Vector> kMap, Vector position) => kMap.Single(k => k.Value == position).Key;
}

public record struct Vector(int X, int Y)
{
    public static Vector operator +(Vector a) => a;
    public static Vector operator +(Vector a, Vector b) => new(a.X + b.X, a.Y + b.Y);
    public static Vector operator -(Vector a) => new(-a.X, -a.Y);
    public static Vector operator -(Vector a, Vector b) => a + (-b);

    public int Steps => Math.Abs(X) + Math.Abs(Y);
}