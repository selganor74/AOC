using System.Text.RegularExpressions;

var rows = File.ReadAllLines("input.txt");

var sizeX = rows.First().Length;
var sizeY = rows.Length;

var columns = new List<string>();
for (int x = 0; x < sizeX; x++)
{
    var currentCol = "";
    for (int y = 0; y < sizeY; y++)
    {
        currentCol += rows[y][x];
    }

    columns.Add(currentCol);
}

var upToRightDiagonals = new List<string>();
var upToLeftDiagonals = new List<string>();

for (int y = sizeY - 1; y > -sizeY; y--)
{
    var currentUrDiagonal = "";
    var currentUlDiagonal = "";

    for (int x = 0; x < sizeX; x++)
    {
        if (x + y < sizeY && x + y >= 0)
        {
            currentUrDiagonal += rows[y + x][x];
            currentUlDiagonal += rows[y + x][sizeX -1 - x];
        }
    }
    upToRightDiagonals.Add(currentUrDiagonal);
    upToLeftDiagonals.Add(currentUlDiagonal);
}

var allStripes = new List<string>()
    .Concat(rows)
    .Concat(columns)
    .Concat(upToRightDiagonals)
    .Concat(upToLeftDiagonals);

var matcherXmas = new Regex(@"XMAS");
var matcherSamx = new Regex(@"SAMX");
int part1 = 0;
foreach (var s in allStripes)
{
    int partial = 0;
    foreach (var m in matcherXmas.EnumerateMatches(s))
    {
        partial++;
    };
    foreach (var m in matcherSamx.EnumerateMatches(s))
    {
        partial++;
    };
    // Console.Write(s + ": ");
    // Console.WriteLine(partial);
    part1 += partial;
}
Console.WriteLine($"part1: {part1}");