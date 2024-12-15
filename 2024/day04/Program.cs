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
            currentUlDiagonal += rows[y + x][sizeX - 1 - x];
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


int part2 = 0;
for (var x = 1; x < sizeX - 1; x++)
{
    for (var y = 1; y < sizeY - 1; y++)
    {
        //find all "A"s (the center of the X-MAS)
        if (rows[y][x] != 'A') continue;
        string utr = rows[y - 1][x - 1] + "A" + rows[y + 1][x + 1];
        string utl = rows[y - 1][x + 1] + "A" + rows[y + 1][x - 1];
        if ((utr == "MAS" || utr == "SAM") && (utl == "MAS" || utl == "SAM"))
        {
            part2++;
        }
    }
}

Console.WriteLine($"Part2: {part2}");
