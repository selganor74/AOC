/*
Register A: 51064159
Register B: 0
Register C: 0

Program: 2,4,1,5,7,5,1,6,0,3,4,6,5,5,3,0
*/
using System.Reflection.Emit;


var program = "2,4,1,5,7,5,1,6,0,3,4,6,5,5,3,0".Split(',').ToList();

Console.WriteLine("Program: " + string.Join(',', program));

static void Run(State state, List<string> program)
{
    while (state.ip < program.Count)
    {
        var instruction = program[(int)state.ip];
        var operand = program[(int)state.ip + 1];

        long literalOperand = long.Parse(operand);
        long comboOperand;
        switch (operand)
        {
            case "0":
            case "1":
            case "2":
            case "3":
                {
                    comboOperand = long.Parse(operand);
                    break;
                }
            case "4":
                {
                    comboOperand = state.regA;
                    break;
                }
            case "5":
                {
                    comboOperand = state.regB;
                    break;
                }
            case "6":
                {
                    comboOperand = state.regC;
                    break;
                }
            default:
                throw new Exception("Unexpected operand " + operand);
        }

        switch (instruction)
        {
            /*
            The bxl instruction (opcode 1) calculates the bitwise XOR of register B and 
            the instruction's literal operand, then stores the result in register B.
            */
            case "1":
                {
                    state.lastInstruction = "bxl";
                    state.regB ^= literalOperand;
                    break;
                }

            /*
            The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 
            (thereby keeping only its lowest 3 bits), then writes that value to the B register.
            */
            case "2":
                {
                    state.lastInstruction = "bst";
                    Console.WriteLine(Convert.ToString(comboOperand, 2).PadLeft(32,'0') + " AND");
                    Console.WriteLine(Convert.ToString(0b_0111, 2).PadLeft(32,'0'));

                    state.regB = comboOperand & 0b_0111;

                    Console.WriteLine("".PadRight(32,'-'));
                    Console.WriteLine(Convert.ToString(state.regB, 2).PadLeft(32,'0'));
                    break;
                }

            /*
            The jnz instruction (opcode 3) does nothing if the A register is 0. 
            However, if the A register is not zero, it jumps by setting the instruction pointer 
            to the value of its literal operand; 
            if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
            */
            case "3":
                {
                    state.lastInstruction = "jnz";
                    if (state.regA != 0)
                        state.ip = literalOperand - 2;
                    break;
                }

            /*
            The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, 
            then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
            */
            case "4":
                {
                    state.lastInstruction = "bxc";
                    Console.WriteLine(Convert.ToString(state.regB, 2).PadLeft(32,'0') + " XOR");
                    Console.WriteLine(Convert.ToString(state.regC, 2).PadLeft(32,'0'));
                    
                    state.regB ^= state.regC;
                    
                    Console.WriteLine("".PadRight(32,'-'));
                    Console.WriteLine(Convert.ToString(state.regB, 2).PadLeft(32,'0'));
                    break;
                }

            /*
            The out instruction (opcode 5) calculates the value of its combo operand modulo 8, 
            then outputs that value. (If a program outputs multiple values, they are separated by commas.)
            */
            case "5":
                {
                    state.lastInstruction = "out";
                    Console.WriteLine(Convert.ToString(comboOperand, 2).PadLeft(32,'0') + " AND");
                    Console.WriteLine(Convert.ToString(0b_0111, 2).PadLeft(32,'0'));

                    long toOutput = comboOperand & 0b_0111;

                    Console.WriteLine("".PadRight(32,'-'));
                    Console.WriteLine(Convert.ToString(toOutput, 2).PadLeft(32,'0'));

                    state.output.Add(toOutput.ToString());
                    break;
                }

            /*
                The adv instruction (opcode 0) performs division.
                The numerator is the value in the A register. 
                The denominator is found by raising 2 to the power of the instruction's combo operand. 
                (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) 
                The result of the division operation is truncated to an integer and then written to the A register.
            */
            case "0": // adv
                {
                    state.lastInstruction = "adv";
                    double numerator = (long)state.regA;
                    double denominator = (long)Math.Pow((double)2, (double)comboOperand);
                    long result = (long)Math.Truncate(numerator / denominator);
                    state.regA = result;
                    break;
                }

            /*
            The bdv instruction (opcode 6) works exactly like the adv instruction 
            except that the result is stored in the B register. (The numerator is still read from the A register.)
            */
            case "6":
                {
                    state.lastInstruction = "bdv";
                    double numerator = (long)state.regA;
                    double denominator = (long)Math.Pow((double)2, (double)comboOperand);
                    long result = (long)Math.Truncate(numerator / denominator);
                    state.regB = result;
                    break;
                }

            /*
            The cdv instruction (opcode 7) works exactly like the adv instruction 
            except that the result is stored in the C register. (The numerator is still read from the A register.)
            */
            case "7":
                {
                    state.lastInstruction = "cdv";
                    double numerator = (long)state.regA;
                    double denominator = (long)Math.Pow((double)2, (double)comboOperand);
                    long result = (long)Math.Truncate(numerator / denominator);
                    state.regC = result;
                    break;
                }

            default:
                throw new Exception("Unexpected instruction " + instruction);
        }

        state.Dump();
        state.ip += 2;
    }
}

State state = new();
Run(state, program);
string part1 = state.Output;
Console.WriteLine("Part1: " + part1);

public class State
{
    public string lastInstruction = "";
    public long regA = 51064159;
    public long regB = 0;
    public long regC = 0;

    public long ip = 0;

    public List<string> output = new();
    public string Output => string.Join(',', output);

    public void Dump() {
        Console.WriteLine("Executed: " + lastInstruction + " A: " + regA + " B: " + regB + " C: " + regC + " ip: " + ip + " output: " + Output);
    }

}
