var data = File.ReadAllLines("input.txt");

var diskContent = data[0];

var diskLayout = BuildDiskLayout(diskContent);
PackForPart1(diskLayout);
// diskLayout.Dump();
var part1 = diskLayout.CalculateChecksum();
Console.WriteLine("Part1: " + part1);

diskLayout = BuildDiskLayout(diskContent);
PackForPart2(diskLayout);
// diskLayout.Dump();
var part2 = diskLayout.CalculateChecksum();
Console.WriteLine("Part2: " + part2);

void PackForPart2(List<DiskPosition> diskLayout)
{
    var lastId = diskLayout
            .Where(t => t is OccupiedByFile)
            .Select(t => t as OccupiedByFile)
            .OrderBy(t => t!.Id)
            .Last()!.Id;

    for (var id = lastId; id >= 0; id--)
    {
        var fileLen = diskLayout
            .Select(t => t as OccupiedByFile)
            .Where(t => t is not null && t!.Id == id)
            .Count();

        var fileFirstPos = diskLayout
            .Select(t => t as OccupiedByFile)
            .Where(t => t is not null && t.Id == id)
            .Min(t => t!.Position);

        var freeSpace = diskLayout
            .Select(t => t as WastedSpace)
            .Where(t => t is not null && t.Position < fileFirstPos)
            .GroupBy(t => t!.WasteId)
            .Where(g => g.Count() >= fileLen)
            .OrderBy(g => g.Min(e => e!.Position))
            .FirstOrDefault()?
            .FirstOrDefault()?
            .WasteId;

        if (freeSpace is null) continue;

        var sourceFilePositions = diskLayout
            .Where(d => d is OccupiedByFile && ((OccupiedByFile)d).Id == id)
            .Select(d => (OccupiedByFile)d)
            .ToList();

        foreach (var source in sourceFilePositions)
        {
            var dest = diskLayout
                .Select(t => t as WastedSpace)
                .Where(t => t is not null && t.WasteId == freeSpace)
                .OrderBy(t => t!.Position)
                .First()!;

            diskLayout[dest.Position] = dest.ReplaceWith(source);
            diskLayout[source.Position] = source.ReplaceWith(dest);
        }
    }
}

List<DiskPosition> BuildDiskLayout(string diskContent)
{

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
            diskLayout.Add(new WastedSpace(position++, id));
    }
    return diskLayout;
}

void PackForPart1(List<DiskPosition> diskLayout)
{
    var done = false;
    do
    {
        var source = diskLayout
            .Where(t => t is OccupiedByFile)
            .Select(t => t as OccupiedByFile)
            .OrderBy(t => t!.Position)
            .Last()!;

        var dest = diskLayout
            .Where(t => t is WastedSpace)
            .Select(t => t as WastedSpace)
            .OrderBy(t => t!.Position)
            .First()!;

        if (source.Position < dest.Position)
            done = true;
        else
        {
            diskLayout[dest.Position] = dest.ReplaceWith(source);
            diskLayout[source.Position] = source.ReplaceWith(dest);
        }
    } while (!done);
}


public abstract record DiskPosition(int Position);

public record OccupiedByFile(int Position, long Id) : DiskPosition(Position)
{
    public WastedSpace ReplaceWith(WastedSpace waste) => new(Position, waste.WasteId);
}

public record WastedSpace(int Position, int WasteId) : DiskPosition(Position)
{
    public OccupiedByFile ReplaceWith(OccupiedByFile file) => new(Position, file.Id);
}

public static class DiskLayoutContent
{
    public static void Dump(this IEnumerable<DiskPosition> dl)
    {
        foreach (var p in dl) Console.WriteLine(p);
    }

    public static long CalculateChecksum(this IEnumerable<DiskPosition> dl)
    {
        return dl.Select(t => t as OccupiedByFile).Where(t => t is not null).Sum(t => t!.Id * t!.Position);
    }

}