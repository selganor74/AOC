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

var listBGrouped = listB.GroupBy(x => x); // groups the list B by value
var part2 = listA.Distinct() // take the distinct values of list A
                 .Select(current => listBGrouped.Where(x => x.Key == current)     // takes the listB's group corresponding to current value of A
                                                .Select(x => current * x.Count()) // multiplies the current value of listA by number of occurrences in listB 
                                                .DefaultIfEmpty()                 // zero if no group exists
                                                .Single()                         // takes the single value produced
                 )
                 .Sum();    // adds up all the values
Console.WriteLine($"Part2: {part2}");


