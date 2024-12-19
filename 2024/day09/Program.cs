var data = File.ReadAllLines("input.txt");

var diskContent = data[0];
List<DiskPosition> diskLayout = new();

var id = 0;
var position = 0;
for (int i = 0; i < diskContent.Length; i += 2)
{
    var fileLen = int.Parse("" + diskContent[i]);

    for (int fi = 0; fi < fileLen; fi++)
        diskLayout.Add(new OccupiedByFile(position++, id));

    id++;

    if (i + 1 >= diskContent.Length) continue;

    var wastedSpace = int.Parse("" + diskContent[i + 1]);
    for (int wi = 0; wi < wastedSpace; wi++)
        diskLayout.Add(new WastedSpace(position++));
}
diskLayout.Dump();

var done = false;
do
{
    var source = diskLayout.Where(t => t is OccupiedByFile).Select(t => t as OccupiedByFile).OrderBy(t => t!.Position).Last()!;
    var dest = diskLayout.Where(t => t is WastedSpace).Select(t => t as WastedSpace).OrderBy(t => t!.Position).First()!;
    if (source.Position < dest.Position)
        done = true;
    else
    {
        diskLayout[dest.Position] = dest.ReplaceWith(source);
        diskLayout[source.Position] = source.Replace;
    }
} while (!done);
diskLayout.Dump();

var part1 = diskLayout.CalculatePart1();
Console.WriteLine("Part1: " + part1);


public abstract record DiskPosition(int Position);
public record OccupiedByFile(int Position, long Id) : DiskPosition(Position)
{
    public WastedSpace Replace => new(Position);
}

public record WastedSpace(int Position) : DiskPosition(Position)
{
    public OccupiedByFile ReplaceWith(OccupiedByFile file) => new(Position, file.Id);
}

public static class DiskLayoutContent
{
    public static void Dump(this IEnumerable<DiskPosition> dl)
    {
        foreach (var p in dl) Console.WriteLine(p);
    }

    public static long CalculatePart1(this IEnumerable<DiskPosition> dl)
    {
        return dl.Select(t => t as OccupiedByFile).Where(t => t is not null).Sum(t => t!.Id * t!.Position);
    }

}