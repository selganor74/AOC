using System.ComponentModel;
using System.Diagnostics;

var lines = File.ReadAllLines("input.txt");
// th first element of each array in equations is the test value
var equations = lines
    .Where(l => !string.IsNullOrWhiteSpace(l))
    .Select(l => l.Split(": "))
    .Select(l =>
    {
        var toReturn = new List<long>() {
        long.Parse(l[0])
    };

        return toReturn.Concat(l[1].Split(' ').Select(long.Parse)).ToArray();
    });

long part1 = 0;
foreach (var eq in equations)
{
    Debug.Assert(eq.Length >= 2);

    var nOperations = eq.Length - 2;
    var nCombinations = 1 << nOperations;

    for (int cc = 0; cc < nCombinations; cc++)
    {
        bool isFirst = true;
        long result = 0;
        string resultingEquation = eq[0].ToString() + ": ";
        for (int digit = 0; digit < nOperations; digit++)
        {
            bool operation = (cc & (1 << digit)) != 0;
            if (isFirst)
            {
                result = AddOrMultiply(operation, eq[digit + 1], eq[digit + 2]);
                resultingEquation += eq[digit + 1] + (operation ? " * " : " + ") + eq[digit + 2];
                isFirst = false;
            }
            else
            {
                result = AddOrMultiply(operation, result, eq[digit + 2]);
                resultingEquation += (operation ? " * " : " + ") + eq[digit + 2];
            }
        }


        if (result == eq[0])
        {
            resultingEquation += " = " + result;
            Console.WriteLine(resultingEquation);
            part1 += result;
            break;
        }
    }
}

Console.WriteLine("Part1: " + part1);

long AddOrMultiply(bool operation, long operand1, long operand2)
{
    return operation ? operand1 * operand2 : operand1 + operand2;
}