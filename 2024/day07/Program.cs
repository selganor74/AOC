using System.Diagnostics;

var lines = File.ReadAllLines("input.txt");
// the first element of each array in equations is the test value
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
            // Console.WriteLine(resultingEquation);
            part1 += result;
            break;
        }
    }
}

Console.WriteLine("Part1: " + part1);



long part2 = 0;
foreach (var eq in equations)
{
    Debug.Assert(eq.Length >= 2);

    var nOperations = eq.Length - 2;
    int nCombinations = Convert.ToInt32(Math.Pow(3, nOperations));

    for (int cc = 0; cc < nCombinations; cc++)
    {
        var allDigits = ConvertToBase(cc, "012".ToArray()).PadLeft(nOperations, '0');
        bool isFirst = true;
        long result = 0;
        string resultingEquation = eq[0].ToString() + ": ";
        for (int digit = 0; digit < nOperations; digit++)
        {
            char operation = allDigits[digit];
            if (isFirst)
            {
                result = AddConcatenateOrMultiply(operation, eq[digit + 1], eq[digit + 2]);
                resultingEquation += eq[digit + 1] + OperationToSymbol(operation) + eq[digit + 2];
                isFirst = false;
            }
            else
            {
                result = AddConcatenateOrMultiply(operation, result, eq[digit + 2]);
                resultingEquation += OperationToSymbol(operation) + eq[digit + 2];
            }
        }


        if (result == eq[0])
        {
            resultingEquation += " = " + result;
            // Console.WriteLine(resultingEquation);
            part2 += result;
            break;
        }
    }
}

Console.WriteLine("Part2: " + part2);


long AddOrMultiply(bool operation, long operand1, long operand2)
{
    return operation ? operand1 * operand2 : operand1 + operand2;
}

long AddConcatenateOrMultiply(char operation, long operand1, long operand2)
{
    switch (operation)
    {
        case '0': return operand1 * operand2;
        case '1': return operand1 + operand2;
        case '2': return long.Parse($"{operand1}{operand2}");
        default: throw new InvalidOperationException();
    }
}

string OperationToSymbol(char operation)
{
    switch (operation)
    {
        case '0': return " * ";
        case '1': return " + ";
        case '2': return " || ";
        default: throw new InvalidOperationException();
    }
}

// from https://stackoverflow.com/questions/923771/quickest-way-to-convert-a-base-10-number-to-any-base-in-net
// Just renamed the method to something clearer
/// <summary>
/// An optimized method using an array as buffer instead of 
/// string concatenation. This is faster for return values having 
/// a length > 1.
/// </summary>
string ConvertToBase(int value, char[] baseChars)
{
    // 32 is the worst cast buffer size for base 2 and int.MaxValue
    int i = 32;
    char[] buffer = new char[i];
    int targetBase = baseChars.Length;

    do
    {
        buffer[--i] = baseChars[value % targetBase];
        value = value / targetBase;
    }
    while (value > 0);

    char[] result = new char[32 - i];
    Array.Copy(buffer, i, result, 0, 32 - i);

    return new string(result);
}
