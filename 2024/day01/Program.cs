// Run this program with 
//    dotnet run
var lines = File.ReadAllLines("input.txt");
var values = lines.Select(x => 
    x.Split(' ')
        .Where(r => !string.IsNullOrWhiteSpace(r))
        .Select(n => int.Parse(n))
);

var listA = values.Select(x => x.First()).OrderBy(x=>x).ToList();
var listB = values.Select(x => x.Last()).OrderBy(x=>x).ToList();

var part1 = listA.Zip(listB).Select(t => Math.Abs(t.Second - t.First)).Sum();
Console.WriteLine($"Part1: {part1}");


