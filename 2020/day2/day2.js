const input = [
    "3-5 f: fgfff",
    "6-20 n: qlzsnnnndwnlhwnxhvjn",
    "6-7 j: jjjjjwrj",
    "8-10 g: gggggggggg",
    "5-6 t: ttttttft",
    "6-11 h: khmchszhmzm",
    "4-6 q: qqbjqqqj",
    "6-8 j: gtkwwjjj",
    "13-14 w: lwgwrwczwwhkww",
    "2-4 p: vcnptzdppvpdzp",
    "4-6 n: pmlnzwrnbnxnpmwmhbnz",
    "4-9 w: wwprdwwwx",
    "13-20 b: rbbcbbbbbbbbsbbbbbmj",
    "1-3 r: zwhrnvr",
    "4-6 f: fmfgfcf",
    "13-15 z: zxzzzzzzzzvxkplvzzz",
    "12-18 r: phjqccgmgzmdwxgtrtb",
    "5-19 s: ssssssssssssssssssss",
    "6-7 d: pddqmdd",
    "7-9 p: pwrlpvlhpfpppzp",
    "4-5 m: mpmmmm",
    "9-10 s: ssxsssssrj",
    "6-9 p: lpjrvpppp",
    "6-13 r: rrrzvtrgrhqxqrvrvwzr",
    "1-3 p: dpjp",
    "6-7 w: wkjnmww",
    "1-5 r: cfqhhr",
    "5-9 m: wmmlpgmqmmrm",
    "12-13 x: sxgnwxxkjwrxr",
    "6-8 n: lnnrnnnnn",
    "10-11 q: kqqqzqqfqqqqq",
    "12-17 k: kkkkkkkkkkpkkhgvnjhk",
    "12-13 v: vvvvvvvvvvvvvv",
    "12-15 h: hhhhhhhjkhhhhhth",
    "6-7 l: hmqtlllnllnlmtqnn",
    "6-9 m: mcmmmdnmh",
    "3-5 k: kkhtn",
    "2-4 n: tnfjmnnn",
    "5-6 j: cjwlmn",
    "4-11 b: bcbbkrlgcbbc",
    "5-10 r: rcrcgrrrzwrrxgpzwrcm",
    "3-4 n: znnn",
    "11-14 s: sssjsssssssssss",
    "6-7 d: rwdddddmdddddkdd",
    "1-4 s: gssssskssss",
    "4-5 j: jjjjzj",
    "11-12 j: cjjjgpjxnjjk",
    "3-6 z: zzkdzzz",
    "7-9 d: mkddddqdhddgdd",
    "1-9 d: rxwqcdrswdg",
    "2-4 m: gmmmn",
    "2-4 k: kkkmk",
    "15-16 r: rrrrrrrrlrrrrrrr",
    "1-11 g: grgggcgggcggp",
    "7-8 q: qqqjqqgq",
    "13-14 c: cxccccgccvcpccccc",
    "2-5 j: txvwlls",
    "3-13 w: plwqwhbwdgxcwfmwjl",
    "9-11 g: ggggggggggggggggdgg",
    "3-12 g: ggsggggggpgm",
    "3-11 g: bcgqgxmbjpwm",
    "8-9 z: zxvzrzzzzzdvzzgz",
    "17-18 z: zzzxzzzzzzzzzzzzsw",
    "9-10 t: ftrmtttktttttdtmdk",
    "15-17 r: rjrrprrrrrrrrrrfrrrr",
    "7-8 k: kkkkkkkkk",
    "6-13 n: nnnvnfgntnnnjnnxh",
    "17-19 l: llllflllllllllllqlrl",
    "11-13 d: hdlddddddhxddddkd",
    "13-17 h: hhhhhhhhhhhhnhhhjhhh",
    "1-12 c: ncccczwcnctcwcc",
    "4-5 w: wgwkl",
    "12-13 w: wwwwwwwwwwwwfwww",
    "3-12 s: scssgwshsspsss",
    "15-17 w: wwwwwcwxmhwwwwwwwww",
    "1-3 x: xxxxw",
    "8-9 p: mpppppppzptp",
    "11-12 n: nntnbnnnnnmx",
    "2-10 x: xrspbmkcthqsdxrdxwx",
    "13-14 l: lllllllpllllll",
    "5-10 x: xxxxjxjdrx",
    "7-8 k: kkkkkkjk",
    "9-11 k: vkkkkkkvkkzddbzr",
    "3-8 r: lbrrcwbdf",
    "6-14 l: lgwllrgllllllgllll",
    "6-9 q: nqqkhqqtqgqc",
    "2-4 g: ggxggggggg",
    "12-13 k: kkkkkjkkkkkvf",
    "5-9 b: scvbbpzbbbzbfb",
    "16-17 d: mdddddddddddddcttd",
    "4-10 l: lllflllllllllllllll",
    "3-6 q: qqqqqtqqqq",
    "1-3 n: pblsghl",
    "9-11 v: bvvvmvfvvgtvfpv",
    "4-5 s: ssshq",
    "5-8 g: ggwgnggp",
    "1-4 f: ffmr",
    "4-5 g: ggwzs",
    "4-5 h: fhhqs",
    "10-17 l: clhlllhslxpgljpvlrkl",
    "7-9 m: pnswhtmvmsrmjwrbfz",
    "6-16 v: vvvvqcvvvdzvjvldvv",
    "5-6 c: cntcrl",
    "12-13 n: nnnnnnnnnnnnln",
    "2-4 w: wwww",
    "2-13 w: swrqssmmwrxtw",
    "15-16 z: zzzzzzzzzzzzzzgqzzz",
    "6-8 c: cctvkbdcwcbvhc",
    "1-2 w: wwzdwjtm",
    "1-3 z: mzzh",
    "6-13 t: fttttdwtttttkht",
    "3-9 g: cggfjgqngwmj",
    "1-5 k: pkkkkkkrk",
    "1-5 q: qknqd",
    "7-11 t: tttttckttkb",
    "6-7 q: qqqqqbl",
    "16-17 c: ccccccccccccccctc",
    "2-5 v: vfcnvlvvvxvrnvvvvvv",
    "1-5 w: nwtwnnwwhtwwdwwww",
    "2-10 v: ftvxxbjzlqctp",
    "5-7 d: nddddgddjdbk",
    "8-11 s: wxqjwkcsflssm",
    "17-20 v: vvvvvvvvpvgvvvvvvvvv",
    "6-8 w: wwlwwwqfw",
    "13-14 r: rrrrgrrrrrrrrr",
    "5-6 t: ttttzq",
    "13-14 c: cccccccccccccc",
    "11-12 k: kwzkkkbdkjkk",
    "10-11 t: ttttpttttrwwtttt",
    "3-4 w: ljwwww",
    "7-8 q: ggqzdvqqw",
    "1-3 z: zzsg",
    "1-2 c: crjvdhgwckszmzpcjmr",
    "10-11 n: nngnntnnnqn",
    "7-16 w: bwdgwwwgwwnnqtcwc",
    "4-16 v: vfkvqvvsvnjhfvvv",
    "10-11 p: fgbhpzqvkmn",
    "10-11 w: wswgwqwszwwhwnwww",
    "15-16 t: stwtfxttthptttttt",
    "1-3 v: vlvsdmrv",
    "5-8 z: zzzzfzzz",
    "14-15 t: ttpvtrlqtlcdrlv",
    "2-6 b: qwfnbkc",
    "6-9 p: jppjpspplm",
    "3-4 s: brgqssz",
    "2-6 q: cqwqlq",
    "13-14 d: rrdljqdddddcxzdc",
    "8-13 s: tsnssssssssrcssrssq",
    "7-8 d: dwddddgl",
    "9-15 b: gspmhlgbbzbbbrbt",
    "3-4 h: khhh",
    "3-4 c: nkccpmcct",
    "6-7 g: ggggggg",
    "17-18 p: ppppppppppppppppjnp",
    "2-6 f: rfjxtff",
    "3-4 g: ggvg",
    "7-9 k: kkkkkkkkkkk",
    "11-16 f: fjdffrtfffjfdffcln",
    "4-8 w: lhpdwbnfssswwfswwwrw",
    "5-9 l: lvlllflll",
    "5-6 t: wtrtlr",
    "4-8 m: mnmmjgqtgs",
    "5-11 n: nnrngbnntnk",
    "5-8 s: ssssfssss",
    "7-14 m: hrnbhsfcvdmxbmvzfvnq",
    "1-5 x: xxxxxxxxwxxdg",
    "1-10 v: vcjvvjvvvv",
    "5-10 l: vvdmhskmprszklvvl",
    "3-17 d: dsddkddddddqddddfjdd",
    "9-13 p: pppppppptpppqp",
    "12-13 h: hhhhhhhhhhjhh",
    "1-4 z: mrvlzlzhzlp",
    "3-4 h: hhmc",
    "7-17 w: wwwwwwwwwwwwwwwwww",
    "6-8 z: cgzxzznzzdhcvwh",
    "4-5 g: mgggg",
    "7-8 t: ttrthtdkjtgtts",
    "8-9 w: wwwwwwwpw",
    "9-15 k: kkkkkkkkkkkkkkk",
    "8-14 q: qqqqqqqqnqqqqq",
    "14-19 w: jkwbwwlwdcmwmmwwrwr",
    "4-5 m: hsxgkdmz",
    "2-4 v: vsvqvcv",
    "4-9 h: grhnhhmhhxhlh",
    "6-14 t: tmttrjbtjtfttc",
    "1-4 d: pjdbrb",
    "15-16 r: rrrrrblrrrrrrrxwr",
    "16-18 p: pppjpppppptpplpppppp",
    "4-7 x: mxtngxnpsx",
    "9-10 b: bbbdbqvmrgbzbbbb",
    "4-5 w: wwwwj",
    "1-2 d: dgws",
    "3-10 l: lglsphlbgfmgdtw",
    "10-11 h: hhhhhfhhhpdhh",
    "5-9 x: xxxxqgxxjf",
    "11-19 m: bfmxmmfgzzhqwsmgwmlr",
    "10-14 x: xxxrxkxxqrlxmpxbdx",
    "3-8 l: lxlxvwlllznlptfv",
    "5-9 h: hhthhhhshdq",
    "1-5 q: sqqqqqqq",
    "9-14 j: jxfcjpjfjjgjjjjjjjhj",
    "1-7 g: gvdgjgsvvgnd",
    "2-5 t: tmttpttttt",
    "17-19 c: ccccclcccccccccccccc",
    "10-13 d: mdvddtsddrxtx",
    "11-12 g: gggggggwggzgp",
    "3-5 k: hzxnpkq",
    "9-11 q: qqqqqsqqqqq",
    "8-9 x: btrkbxngx",
    "3-5 g: jpkchcxcxhzfhsggqkg",
    "7-13 s: ssssssssscssssn",
    "13-15 p: pppppppnppppppp",
    "5-15 f: ffffjfffffffffgf",
    "2-4 p: zqphp",
    "1-4 r: wrrr",
    "3-9 b: jsjcbrkkczkzmjbg",
    "1-2 k: kkkkl",
    "2-3 n: dlnxjwzstsdxns",
    "7-14 v: fvvvvzhhvpsvvckdvv",
    "2-8 r: rrrrwrhrrrr",
    "5-8 n: nnxdnnnnnn",
    "5-12 c: scmcdscccccmcc",
    "9-10 v: vvvvvvvvjm",
    "14-15 w: lwppdwwwwdmrrww",
    "6-7 c: qcgcvxdrcccpxchrnlq",
    "8-10 x: hbrqsksxwxxttz",
    "18-19 w: jnftgwpwmwfdgrcpkww",
    "3-4 k: ffkj",
    "5-9 f: flffsvffsff",
    "3-4 k: kkkkk",
    "1-3 l: dlglkll",
    "10-16 f: bfffjzfffnfffffxhfff",
    "11-20 d: ddbdqsddddddddddfddd",
    "6-20 l: vmjltmkclbmqrflzgdzl",
    "5-19 f: ffffffffffffffffffff",
    "5-10 n: nnnnmnnfnz",
    "4-13 f: kmrfrfkvjxdbftvhnsdm",
    "10-11 k: kkkkkkkkskk",
    "12-13 k: kkkkkkkkkkkhj",
    "7-8 p: ppppppnhw",
    "5-8 l: gtpllwklh",
    "13-14 h: hhhhhhhhzhhwsrh",
    "7-15 h: hhhhhhthhhhhthqgfh",
    "1-3 f: mfdmhv",
    "15-16 f: fffffflfffffffbqf",
    "12-13 c: cccmcccccccxn",
    "2-12 q: nqltxqfdcrxqvt",
    "8-10 d: dddddddddvdddd",
    "2-9 g: mdrwnvtsd",
    "12-13 l: lllllllllllll",
    "2-3 m: mnrgmdm",
    "6-9 v: hvvvvvvvv",
    "4-7 q: bqqqrqcqqqq",
    "8-11 v: vvvvdvvvvvr",
    "3-4 n: cnnw",
    "2-12 r: rrrklfrrrksrr",
    "2-12 p: pxppklhsppwdxwcpzvm",
    "10-11 n: nnnnnnnnnnn",
    "5-6 w: wfwwww",
    "3-5 p: pppppp",
    "3-8 g: ggggggggggggggg",
    "1-4 x: xxxxx",
    "11-16 d: ngcdkglddtppbddgdrd",
    "11-12 k: kkkkkkkkkkhr",
    "12-13 c: hgxxchcvxpdlsrt",
    "1-3 m: vmmm",
    "4-6 z: kvzgzzzp",
    "11-12 d: dzddzlcbvdxk",
    "10-11 g: ggsgggggggggdz",
    "6-8 q: xfhgpqltbfbdzqg",
    "4-7 v: vvvlvcxmvvxq",
    "5-7 v: vkkgvgvnpvvlpgkv",
    "6-7 b: bbkvnwbqblbvbb",
    "2-4 l: wmll",
    "6-9 j: djqjcxxljm",
    "3-4 j: nmzcsnlnjjjdms",
    "3-8 w: wnwwsvww",
    "9-20 m: wbntxzztwmblxmsmltmg",
    "7-8 r: rprrrtrf",
    "1-3 r: lnrfxfswmhgvf",
    "5-12 k: zlkdlktsrqjt",
    "13-14 v: vvvvvvvvvvvvvbv",
    "11-12 d: ddddddddddgc",
    "9-11 c: mdwpjjcdcrc",
    "5-6 m: mmmmnl",
    "5-6 l: lblldn",
    "13-14 c: sccfcxsnsclccc",
    "4-5 q: qqkkq",
    "5-8 m: mmmmmmmm",
    "5-8 z: tzhzzttzvwfcv",
    "12-15 b: bbbbbbbbbbbtdfb",
    "7-10 b: bbnplbbxxbh",
    "1-7 x: zxxxxxvx",
    "6-17 b: kbnbbbbbptbbrbbbb",
    "1-3 l: llllll",
    "13-15 c: ccccccccccccqcz",
    "1-8 s: sssssssb",
    "12-19 x: xxxxxxxxpxxcxxxxxxq",
    "12-13 x: xxxxxxxxxxxxxx",
    "14-18 w: wwwwwwwwwwwwwlwmbk",
    "7-8 q: mzwqblqqz",
    "1-7 p: hrppppgdzp",
    "2-7 n: qmvpmsjncgkgpbb",
    "8-10 x: xxxxxxxwxx",
    "2-4 v: rfcpmpvsswsrjkxpdrxh",
    "14-16 k: kkkkkkkkkkkhkkskkt",
    "14-15 d: ddddddkdddddrqdd",
    "4-16 m: njmqmmmjfmmxhmwgdbc",
    "12-13 h: hdmdfhhhzhkdhr",
    "3-14 n: nbntrsmnmrcwbf",
    "6-8 h: hhwhhlhnhh",
    "18-19 v: vvvvvvvvvvvvjvvvvvp",
    "11-20 l: ldllllbvllmqllmlllfl",
    "2-3 d: dcddd",
    "4-6 n: bsnncn",
    "3-6 f: dwlfqfzgs",
    "8-12 d: xdddddfhnddfddd",
    "5-13 l: llllqlllllmllll",
    "10-14 m: mnmzrmmmmwmmqm",
    "3-12 c: qjchcclnbccccpc",
    "7-16 j: jjjjjjwjjjjjjrjnjj",
    "1-10 v: svvdvvgmgpkfkvhvv",
    "2-4 b: gbpbczblbbv",
    "7-9 w: drwwbwtgwswwww",
    "2-8 h: fhkprhplz",
    "1-6 m: mmmmwm",
    "3-4 g: gggp",
    "1-3 q: qqqqj",
    "10-11 h: htfrdwrnkzntnfpdmkhq",
    "5-6 x: nxxxxxxxj",
    "7-8 w: wwwcwwww",
    "1-5 h: lhhhhh",
    "7-8 f: ffjfftff",
    "3-5 g: kdgfgjgbghggp",
    "2-11 p: flgpvfbhpzxmmntw",
    "12-13 z: zzzzzzhzzzzgzzqz",
    "12-13 j: ttmhmdfjpdpnj",
    "5-7 h: hhhhvhh",
    "9-13 x: xhxbxxsxxqwxxvxxxx",
    "1-3 c: ccchcc",
    "2-5 h: hhrsh",
    "1-3 q: rqqq",
    "2-8 x: sxrxbcxx",
    "12-15 b: bbbbnbbrbcbtbbb",
    "14-18 m: hmmmmmmmkmmmmmmmmrmm",
    "1-4 v: vvvv",
    "5-11 h: brnzvqhrrwh",
    "4-10 f: dbtfdvlfnffqmwp",
    "3-16 r: krrrvmrwrrrtrrrrkrwr",
    "11-15 c: gxbccccccccccbh",
    "13-18 z: zzrzzzzzzzzzzzzzzzz",
    "1-3 l: lkvxtrthfvmdzn",
    "7-9 p: vpppmpppppp",
    "3-4 w: wwwwwwww",
    "8-11 z: vlzzzlzvzzmzzz",
    "2-4 v: vqfv",
    "10-11 s: sssssslssgss",
    "4-5 z: zzzww",
    "11-19 p: zpbpdjfjpdfgnpphhpg",
    "1-8 f: fftlxmfl",
    "9-10 p: phlpqzppxpxp",
    "5-7 q: kbqjqqq",
    "3-6 m: jcblmv",
    "9-10 l: llllllllll",
    "13-14 w: wbwhwwwwhwqwmswwmjwf",
    "6-11 j: jjjjvtjwjbdjj",
    "4-8 j: jljjjvgj",
    "3-4 r: lrhvrzrr",
    "2-4 p: plpfkphpq",
    "2-6 b: bbbbrbvwbbgh",
    "2-11 t: mmjmcwcdcbtztxfbtst",
    "7-15 r: grsrrjrrtrgvrtrrr",
    "6-17 d: dddddgddpddzddddddd",
    "3-10 t: qpnbrnmmjtjxtdg",
    "6-7 v: vvvvvhb",
    "5-20 j: vxmkjnssjdtldsdwltlg",
    "7-10 r: rrrrrrrrrrr",
    "2-4 r: rrpl",
    "3-4 m: mmzg",
    "1-8 h: fshhjrhm",
    "5-8 m: mmmvmmvmmnmdxnjcjpn",
    "8-10 m: mmmmmmmlmzmm",
    "14-15 q: qqqqqqqqqqqqqqb",
    "6-16 q: qhkdtqnzqqqjgjrqrkbq",
    "3-9 b: gtbbfgfhbs",
    "14-16 h: hhhhdhhhmhhhhmhhh",
    "9-10 n: nnnndnnnvjnl",
    "11-12 p: pqpppppppppppp",
    "7-9 d: ddpwfdtdd",
    "6-10 z: qzzzzjzzmz",
    "9-14 q: qqdjqdqqrqqwqnqqp",
    "6-7 k: kkkkkbkk",
    "7-14 j: hjvjmzkhgltffljjvjj",
    "4-5 z: znhzz",
    "11-16 r: rrrrbxdrrqrrsrrb",
    "5-8 v: vvhvvvvvwvlvhlqg",
    "4-10 n: wvnnjnndcnk",
    "5-6 g: ggkggk",
    "8-9 w: wwwwwwwww",
    "5-9 r: mrwrrrrrx",
    "4-6 r: jcfrjrrrg",
    "6-9 w: wkwwsxwgfcwqb",
    "5-6 x: grxjxnrb",
    "2-7 s: nsmldnsszdk",
    "5-9 j: gjjzkjvjwjcjbj",
    "6-11 r: jtrgcvwccrrrfmj",
    "7-12 j: jfjjmjjjjxjqzdjjxq",
    "1-2 n: nnwqcnr",
    "5-16 l: lllpclllllllblllll",
    "5-6 j: wjgdjcdpjxfjxnjj",
    "3-16 s: klstwqksfclmcbbcn",
    "17-18 t: ttttdtttttthtttttttt",
    "9-13 p: ppppppvpvhhqp",
    "1-2 n: tsnnn",
    "3-4 p: jpqpjmpplpw",
    "4-6 t: dtfthsxtfpd",
    "2-6 m: zhszctkm",
    "1-13 p: dppmkpbprgppxcpvhrpz",
    "2-7 m: gvmmflp",
    "9-16 c: rcdsppjbcwdxnfbc",
    "5-15 p: pppxpppqnhpptpppz",
    "10-13 q: xfhqhkqkjqjwqqcfrgl",
    "14-15 t: tttttttttttttdvtttt",
    "5-8 q: qqqbqvqzqqn",
    "1-7 v: cvgvvbcgjv",
    "6-9 r: rrrrrrrdr",
    "2-11 j: wjjgxngswkj",
    "11-13 d: dddddddddddddm",
    "5-8 p: pzppppppkjp",
    "15-16 c: cccccccccccccctc",
    "1-7 c: vsvkccbc",
    "2-5 h: hhhhchhhhhhhhhh",
    "9-11 n: nnnnnnnnnnnnn",
    "11-12 q: mdmfmkxcxzjq",
    "6-11 m: mmkgnjdhfbc",
    "1-4 d: dgrdwbdfdkdrmthsj",
    "12-14 k: kkkkkkkkkrjkkkkk",
    "2-4 d: hdrvdzd",
    "2-3 s: sxmsssssssssssssssss",
    "13-15 z: zzzzzzlzzlzztzzz",
    "3-8 r: lxrrrnvrtrgnmkrr",
    "6-7 w: wwlbrwwww",
    "4-7 r: zlnmmkpnrkkcrrxrmfq",
    "2-6 v: zgvvjjvvjhjv",
    "8-11 l: llllllllllcl",
    "8-14 m: mlmldmmgnqzmmmm",
    "7-10 z: wzzzzhtzdqzznzz",
    "4-7 k: mvgwkkk",
    "5-9 p: pdpltvdpptpppg",
    "4-15 q: qqqfqbzqlqqqqqpqfqs",
    "5-7 q: qqqcxqqm",
    "14-17 x: rltjxxbxxxllsxwcx",
    "1-13 w: gwggwwwwwwbsbwkwwd",
    "8-14 k: kkbkkkkhkkkxjzblgk",
    "5-8 p: cppnpprp",
    "6-7 k: jrnvhkkgkkb",
    "12-14 h: hhhhhhhhhhhhhn",
    "10-20 j: gjwjjjpjjljjjjjsjjjj",
    "16-17 n: nnnnnnnnnnnnknnnnn",
    "5-6 f: cdpppf",
    "12-13 z: bvpzqzzlwzccfszt",
    "1-9 k: wdkkvtrprltkkltz",
    "9-16 x: xxxjxdxhtzjxgxsbx",
    "17-18 j: jjjjjjjjjjjjjjjjlrxj",
    "2-5 x: xkknmxxxn",
    "3-9 f: tfffhfffffff",
    "11-16 r: rrlgrrqmrrprcrrrvjr",
    "9-12 m: nrlmgmxvgkmpmqvntx",
    "4-7 r: hrrrzrrnm",
    "3-15 g: stgjgbgggvdljcgdgfg",
    "6-9 j: jjjzbpjjjjjj",
    "2-3 p: ppjp",
    "9-10 t: tttttttttt",
    "10-12 w: wwwfwvwvnkwdwww",
    "11-14 d: nvljddddftrndzx",
    "6-7 r: rlrrrbqcrqr",
    "2-4 c: xbdl",
    "11-18 c: ccccccccccvcccccccc",
    "5-6 j: gjjjjjj",
    "3-7 w: xwhnqlhnpfrvlkqqrp",
    "6-19 q: qqqfxdglhqqkqqqjnhdq",
    "8-9 d: ddsdddqsv",
    "14-16 g: gggggggggggggggt",
    "3-5 b: bbbnh",
    "11-14 t: mtttwttfttttltq",
    "8-10 x: xxxcxxxfxq",
    "8-11 l: lfgvnlzrfcllnxss",
    "1-3 t: gtttttttwgtptt",
    "1-20 j: jjgjlqjjcjcjjjsjgjlj",
    "8-14 v: dqgmngvvqnswvvrrvc",
    "2-8 m: gmpkmmsmmmmm",
    "5-6 m: mmmmtm",
    "6-7 z: zfzrxzxz",
    "4-15 k: wmwkhhskgwzqpnk",
    "2-6 d: hddddfzdsdtvg",
    "9-10 g: gggsggggggrgggqg",
    "11-12 m: mmmmmmmmmmmm",
    "5-7 w: wwhqqhwwwwd",
    "4-9 k: gtkrkkkdfk",
    "1-4 g: kgtvg",
    "7-11 r: rhdbzjrwrcr",
    "9-18 f: fjffffffdffkfffffvf",
    "3-5 t: ttttt",
    "13-14 q: qqqqqqqqqqqqcqqq",
    "1-8 n: vnnnnwnqlbln",
    "3-5 s: ssmss",
    "2-4 q: qqqbkvqxh",
    "3-4 n: nshscq",
    "10-18 s: sssssssssnsssssssgs",
    "9-10 v: vvvvvglvzddvvjv",
    "5-16 s: sspssssrssssslss",
    "4-7 t: ttptxtt",
    "2-4 r: rrrrrxdrr",
    "8-9 b: xqvbbbbbh",
    "3-4 b: bbbbc",
    "1-13 v: qhvvvvlvvvvvdv",
    "4-8 l: lhkllblwllll",
    "3-4 q: qhjgq",
    "8-9 p: rpbpppshdpp",
    "13-18 k: kkkkkkkkkkkkkkkkkx",
    "8-9 r: rrrrrrrrr",
    "5-10 f: bjfwwqvjwffpnl",
    "1-3 l: pbhl",
    "4-6 g: mggfgv",
    "1-4 t: tttttt",
    "5-10 t: llqrtccxtttntxjcdczk",
    "13-14 q: qqqqmqqqdqqfqgqqqq",
    "6-10 w: wpwmwwrgwwk",
    "13-16 q: qqshgkqkqvscqtqq",
    "4-5 t: qttdt",
    "2-12 h: fpbbxgpskzjpkvtr",
    "10-12 z: zrszvzzzzrzkznpzw",
    "1-4 z: tgzz",
    "3-6 c: cdwccvgm",
    "1-15 q: jqqxkqrqmtfqpvbpq",
    "4-6 v: vjvlvvv",
    "1-7 l: hjlllwj",
    "6-13 s: lrspslfwsgjks",
    "3-4 p: dpvk",
    "4-8 h: hsjjhhff",
    "1-18 k: pkkkkkkkkkkkkkkkkkk",
    "6-8 n: nvcnxqnnrnnn",
    "7-8 p: ppppppvzp",
    "12-17 h: hhhhhzhhhhhkhhhhph",
    "13-17 p: ppmpppnppppplpbvcppp",
    "8-14 m: tmmcjvmmjgcfmmnj",
    "1-3 t: tttth",
    "3-4 x: zxxx",
    "1-3 d: kpwhxpctcgdbdkb",
    "5-6 z: knnlzzzzxjrghzb",
    "9-10 w: wwmwwwwxgww",
    "9-11 b: bqbbfbbwbbqbb",
    "2-3 d: ddxp",
    "10-12 g: gggvgsgtgggggbg",
    "3-4 b: gbbb",
    "8-20 c: jccqcxjcqfncfcbccgcc",
    "4-9 z: zzzztzzzzzb",
    "2-12 x: gmfmzzrxsqbx",
    "10-12 x: xxxzbxxjxxxkxb",
    "3-4 v: szpvbvlvr",
    "2-5 r: grqqr",
    "4-8 q: mqqnvqvqqq",
    "6-10 v: vdbvnvvxvvvnvvvvv",
    "4-10 d: dddtdddddjd",
    "3-4 l: klmc",
    "10-13 k: kkbkkkvkhkvkkkkkl",
    "1-3 v: vvkz",
    "13-14 h: pkgffgcszgsghbcdtpm",
    "11-16 c: dgccccccctchxbfm",
    "8-9 b: bbbbbbbbbtb",
    "1-9 h: hrnhhlphhh",
    "17-18 s: ssssssssssssssssst",
    "5-10 h: hhhhhzhhhhhx",
    "2-7 k: dlrncbkkwp",
    "3-5 k: kfqkk",
    "4-8 d: ddddddddd",
    "10-15 m: mmmmrmmmlpmmmrgmkmx",
    "2-4 g: gsgggkm",
    "7-9 l: llsllllvrzlxlrgglk",
    "2-9 f: fzfbvfkff",
    "13-14 p: pxppppppppppvf",
    "15-17 z: nbkxkjtszptcndzdl",
    "3-6 z: zzxzzhz",
    "12-13 t: tttttttttttttt",
    "5-10 s: pssbfsbsssnssvsb",
    "9-18 c: ccxthchscjjdccvcncl",
    "3-5 f: fndfqffffff",
    "2-4 m: clwvcdjmz",
    "7-8 b: bbbpbjbb",
    "2-3 r: rbxx",
    "3-8 j: jjjjjjjjj",
    "5-10 v: zrwnvbrvmm",
    "4-6 h: hhghhhhh",
    "6-8 f: fnffzfwfgffpfc",
    "5-6 q: qvqqqqkqqq",
    "3-5 v: vgwvrgqc",
    "9-10 p: pppphbbpphppb",
    "10-12 l: rdjrcxkgflll",
    "9-14 h: qwwxnhfhnfhhbhhjr",
    "9-10 d: ddddpddddd",
    "4-13 w: wwwwwwwwwwwwwwww",
    "8-16 x: xrxxxxxxxdlxxxxxxx",
    "6-10 p: pplppkpzwb",
    "5-7 j: wpjjjgjjvjqjrgj",
    "4-13 w: cwwswwwwwjwwdvw",
    "5-6 j: jjjsjjj",
    "4-5 c: ccfccqdqctllbm",
    "7-13 c: bcccccccccccccc",
    "4-5 p: pgptw",
    "1-4 p: qpwmp",
    "3-5 f: fftfff",
    "2-6 m: mmhbpmjlx",
    "9-13 r: zrrczrlrzqxrszrrlrr",
    "2-9 w: xrszwwwdkww",
    "6-14 g: qlwswsgjdlgmzvwg",
    "6-8 z: zzzzzzfz",
    "6-7 w: xwzsjjr",
    "2-13 f: fxmfdnfffkpggz",
    "1-7 d: rdnlqdplfddjdd",
    "11-14 j: kjjvjjjxpjjjjjzjjjz",
    "12-14 p: gpppwvmqpfpptpfppkpc",
    "6-11 k: kkkkkhkknkkkkkgk",
    "2-6 m: swpgmf",
    "1-3 x: sxzqnxxv",
    "12-18 n: nnnnlnnnnnnnnnnjnxnn",
    "3-4 p: pppq",
    "8-9 v: vvvvvvvpv",
    "6-9 l: ltsldwtlhll",
    "11-14 x: xxxxlxxhdtxxxxxsxx",
    "4-5 q: qsqvqvq",
    "5-6 b: sbbbbt",
    "10-13 l: lllllslllrllll",
    "1-5 m: zmmmmmmm",
    "2-10 s: ssssssssss",
    "5-8 r: qqcsbjcrljvksc",
    "11-15 n: bndcnknnxnnnnnbn",
    "14-15 v: tvvvvvvvvhqwvvv",
    "2-3 s: jsvcsb",
    "12-15 d: mddddfddddlxddddd",
    "12-18 w: wwznwcgwwwwwwhwwgwgw",
    "2-9 v: dxlvvlvqg",
    "2-5 h: njpsxr",
    "11-13 m: rmmmmmmqmmzmtmm",
    "4-8 m: smmmmmmm",
    "3-10 j: ngwtkjfrjjtrxfnvj",
    "2-3 p: ppwwpp",
    "3-5 c: cbmcncnqc",
    "11-13 m: mmmmmmmmmmcmm",
    "4-14 g: gggggggggggggxg",
    "2-4 b: bbfb",
    "16-19 p: ppppppppcppdpppmppwp",
    "10-12 g: gghgxgkvggrggrg",
    "1-8 b: wjjqktjbbfkdz",
    "8-11 c: cqccdcncfcccnc",
    "2-10 z: qzvlqltzns",
    "3-7 p: kgpmpzpbx",
    "1-6 m: mxmdmlmmzmmmmmmmmm",
    "1-7 r: rrrrrrrrrrrc",
    "8-10 h: whhhqhhhjjhnch",
    "6-10 x: xwxxxxkpxdkdnxvh",
    "10-12 z: zzzzzzkzzpzzzzz",
    "1-12 s: dssssssssssds",
    "4-7 f: fvzbfcf",
    "5-6 w: fwwxfwmswxkd",
    "14-15 g: gggggggzgggggfhg",
    "6-7 j: jjjjjnb",
    "1-6 v: vcgksvnrbgsvkrwsc",
    "6-15 w: wkvwwwpqwwwbtwxvhw",
    "8-9 m: smmmmmmmmm",
    "14-15 r: rrjrlrrrrrrrrzbr",
    "3-8 w: tjqncxsnqkdpwzm",
    "4-5 k: kkkkk",
    "8-11 z: zzzzzzpzzxzzkzglzrz",
    "5-6 k: kkkktzk",
    "18-20 w: wwwscwwwwwwwwwwwwgws",
    "1-12 z: dsfxzctdzzjxbt",
    "14-15 q: qqqqqdqqqqqqqqq",
    "7-10 r: rrxrrqrrxcbr",
    "1-13 d: fmgjzgqhdhddd",
    "4-6 g: mnggxttn",
    "6-7 v: gwtmscl",
    "11-14 g: gggnmgggggjggcgggrgg",
    "17-18 k: gcslskskkkwkwkklkk",
    "14-16 r: rrrrrrrrrrrrrbbrr",
    "13-15 s: sjsxszssgfssdgwsbbsp",
    "1-9 d: dddddddddddd",
    "1-13 j: mnjjzckxzjjdj",
    "1-2 j: hwrqjxxcj",
    "6-7 z: fzzzwxnnrg",
    "2-10 x: wxnqjddpxxpxw",
    "3-10 s: srvvssdcvzfn",
    "3-11 w: gwwwmwvwwww",
    "3-4 q: qnqs",
    "11-12 d: dddqdddzdrddddd",
    "2-15 l: wldlltxhrwzzlhz",
    "4-7 g: vgsgkfgmc",
    "7-9 t: jdsltcgttdttd",
    "9-10 q: xvqjqqqwqqqqqpqq",
    "6-9 b: bbkbnbgbbb",
    "2-5 t: ttcjtbkb",
    "7-8 r: rdrrqrnrrrrrvp",
    "2-4 f: pnfqfffvpfffffhbffv",
    "10-12 z: kzzzzzzzzrzpzszz",
    "4-5 m: tmmgxlm",
    "3-4 k: kwhhk",
    "1-11 h: hhhndhhfhvhchmmqhz",
    "6-9 m: lmmmmmmmtmmm",
    "1-5 d: dwdkd",
    "5-6 d: dddddq",
    "7-9 j: jjjvgvmjdjbjj",
    "3-6 w: gwzhpjwkg",
    "10-11 h: hhlmftlhkhhnh",
    "8-20 h: hhgnchpthzhhhhqqwhcz",
    "6-7 s: sssssgfs",
    "3-11 g: jfgqgbvqppjn",
    "5-6 d: ddqkmbd",
    "14-15 h: hhhhhhhhhhhhhphhh",
    "12-13 l: fwkwphdlwmfwg",
    "3-4 z: pmbncwz",
    "3-4 w: lgwv",
    "3-4 s: sshs",
    "2-7 z: zzflznzzzlzl",
    "1-2 k: klbjvbwpkkptb",
    "17-18 r: rrrrrrrrrrrrrrrrlrr",
    "7-8 l: mlqgltml",
    "9-14 l: llljlllxllllvl",
    "5-13 b: bbbbtbbbbbbbfbbbg",
    "7-10 d: cddlddgdqkld",
    "4-6 q: kqqqqq",
    "5-11 r: rrrvrrrsrjrr",
    "7-10 t: tttgtltttbt",
    "13-14 h: hhhhhqhhhhhhndh",
    "3-4 s: dsss",
    "6-12 w: jwwtxwwwkkwbw",
    "7-8 v: cvvgnvvv",
    "12-16 q: qqqqqqqqxvqqqrqqqq",
    "6-11 z: zzkvzvzzzxzzzz",
    "4-9 s: lcrvsssmfs",
    "6-13 c: ccccpdcbcbcgdcccgdcc",
    "7-9 q: qpqqqqqqhq",
    "1-10 k: kwfkkxrkwhtmkwknkx",
    "9-20 x: dxzrxxxsxxxjxxsxdczx",
    "15-16 c: ckcccdccccccgccdcccn",
    "2-7 s: sscxswskxhchxpfs",
    "2-3 h: hhlh",
    "2-6 p: ppppppp",
    "6-8 r: ztmrsjqtrk",
    "1-2 r: drsdvpmzdn",
    "6-7 v: vqvvvgp",
    "5-6 g: gggggg",
    "3-7 d: tfkddmjzjgdxzlkd",
    "16-17 b: bbwbbbbbbbbbbbwbt",
    "2-11 b: hbrwqqhkcrbbvmx",
    "5-11 f: ffffqfffffffff",
    "2-5 n: nnwhn",
    "8-11 j: jxjsjjmjkjkjhjx",
    "1-3 h: hhhh",
    "5-12 t: pttttszttwvlt",
    "7-8 q: mqqqqqqqtkq",
    "7-10 z: xzzzzzdzzzzzzzz",
    "6-7 l: ljzqklhmm",
    "3-5 k: bkkkrk",
    "6-8 x: xxxxxlxcxxxbx",
    "6-7 j: jjqjcpjfjj",
    "8-9 l: cwmllhslwv",
    "14-15 z: zzzzzzzzrzzzzcz",
    "11-12 f: sfccmxxffsfg",
    "5-6 q: qqqqqqqq",
    "12-15 t: tttttttttttttttt",
    "7-12 q: pqwsnhqfzdtqxd",
    "4-5 b: fbcbb",
    "5-7 t: tttstft",
    "2-4 h: vjmr",
    "4-6 r: rrfrprr",
    "18-19 x: xxkxxxxxxxxxxxxxxxxx",
    "2-4 k: qklkc",
    "3-6 s: svjsrs",
    "14-15 j: pjjjhjjjjjjdjgj",
    "2-15 l: lhllllllllllllwlll",
    "2-7 q: qvqqgsq",
    "2-6 z: zzlzzzn",
    "8-15 p: pppppppspppzppgp",
    "3-4 l: kfzbl",
    "9-12 w: hqjwwtdwwlwwmw",
    "3-4 k: lghgg",
    "3-5 k: khgzkk",
    "2-10 r: rrsjlmrsrr",
    "2-5 j: jjjjj",
    "10-12 j: jfgzbdbjwhjjjf",
    "1-4 f: ffff",
    "9-10 j: jjjwjjwzgtcjzj",
    "1-6 m: mmmmmq",
    "5-6 h: hhwhph",
    "3-6 w: wwpwwz",
    "5-6 q: qqqkcb",
    "8-9 f: ffffffxrff",
    "13-14 m: lqvpbrhgmxmkgj",
    "4-6 q: pqqxqk",
    "7-11 b: mbbnsvbbjbbmb",
    "17-18 q: qqqqqqqqqqhqqqqqqqq",
    "3-12 w: qzcwxswwzvwzb",
    "10-11 l: llllllllxxs",
    "1-4 c: bvcch",
    "11-13 s: svssqfvssshst",
    "6-7 l: lllllrl",
    "5-8 n: nhqkfnggnpkbhpgntlht",
    "1-14 g: pgrdgjggggpggc",
    "12-16 n: hlnhkxpnnsfctsnq",
    "6-8 c: cccftqcfqc",
    "1-5 f: fbfff",
    "1-15 t: mttptftctttptttt",
    "6-11 t: cxtttnnfttt",
    "7-11 h: hsrfjswhhhhhhhhc",
    "12-13 b: bbbbbbbbbbbnfbvb",
    "12-13 x: lzvxjxxxcxxxq",
    "12-13 p: ltwhhhqvdjptbsw",
    "7-9 z: zzzzzztzn",
    "4-5 g: ggqlgg",
    "8-10 r: rbqxwzfhlzt",
    "3-5 g: grhgk",
    "14-19 z: zrzzbzztszpzvzbdfzm",
    "7-11 d: tdjbcdpdddb",
    "3-7 j: jpqjjjj",
    "1-2 m: mcxklcmmws",
    "7-8 r: drqlcrfqrgrrxrrg",
    "1-5 g: kgngw",
    "8-10 r: wrrbfrrrpntjrrrgrr",
    "1-4 s: sstf",
    "3-7 b: fnjnpmfjlwb",
    "2-5 s: pwjkj",
    "9-11 t: tbtbtrsrfzntwqq",
    "13-16 m: mmmmmmmmmmmmmmmmm",
    "13-18 b: bbbbbbbpqlbbbtbtpxb",
    "9-11 w: wclwwwrwwwkhww",
    "7-13 b: bbbbbbbwbbbbb",
    "8-12 t: sxlwtttttnhn",
    "4-7 q: kmdqxcqswqw",
    "3-4 r: rjrr",
    "4-6 m: mdmdmmmm",
    "6-17 h: kjrkchhnfhqqcrmhhhdh",
    "6-9 j: vjjgcjjjpdj",
    "7-9 x: xxxxsxxxxx",
    "8-16 j: jjjjjgjnjjjjjjjczd",
    "6-8 t: tttttttd",
    "7-17 s: ssmsspvsssspssssfssl",
    "3-10 f: cgffsqxhdmrvdf",
    "1-3 f: wfpf",
    "11-12 k: kkkkkkkkkkfqk",
    "12-15 s: cxghswzsbttmvpscr",
    "3-4 n: nnkn",
    "7-17 w: wwlwnxwxwwswwwwwg",
    "3-10 h: hhvhhhrhhhfghhcn",
    "10-11 l: lllxlllllllsl",
    "5-7 d: ddbddtddv",
    "5-15 g: ggtggqggggzggggwggv",
    "2-10 r: mrpdmtrzsrngstsr",
    "9-15 t: bsbptttttqwzmmtgbgm",
    "8-10 q: qqqqqqqqqqq",
    "6-9 h: hlrbcsnhh",
    "12-17 f: ffkjfffffffnftfmf",
    "11-12 s: ssssssssssss",
    "9-15 k: hpkskfkkfkkkkbkk",
    "8-18 b: bbbbbbdbbbbbbjbbjw",
    "2-14 p: nppppkkppppppw",
    "11-12 s: sxhtlrtnbgss",
    "8-10 q: lnwqqqqqqsqhgqgbq",
    "2-3 l: llll",
    "14-17 d: gdddtlfmrdscgsqcmkm",
    "5-8 w: tmmskwpq",
    "16-17 b: cbbbpzbbrrbnkbbbbgj",
    "14-17 b: bbbjbbbbbbbxbvbdszbb",
    "9-10 q: qqqqqtqqqqr",
    "5-6 t: ctgttztrtn",
    "2-3 f: gcfgw",
    "3-8 d: ddzddddsddddddd",
    "15-16 g: ggggggjggggggggg",
    "4-10 m: mcmmmmmmmmmvmmmm",
    "11-15 p: ptppxjppppmkgpvdp",
    "12-13 n: nnnnnnnfnnnrn",
    "1-7 t: tnbwtttmtt",
    "1-14 c: ndncvjbkcmcjplcp",
    "1-2 f: fffh",
    "14-17 t: llzkwltkmdntwndqs",
    "4-7 w: bffzzwdwtkwwv",
    "4-8 p: zpbpqpppxpb",
    "8-14 n: fdnnznhnnlhmtn",
    "7-14 l: vltrjnzhplkshlt",
    "1-2 d: ddbhsjtv",
    "2-10 d: dddddbzrdrdd",
    "4-10 p: pkppshsfmp",
    "10-11 g: gmgggzvzmgjgggzqxggd",
    "2-4 j: fjvjjqf",
    "5-19 h: cstkhhrctkxhhsfzpph",
    "6-16 s: sssssssssssssssks",
    "17-18 v: vvvvvvvvsvvvvvvvtv",
    "2-5 j: zjjjjj",
    "2-3 r: xrrrqlxl",
    "17-19 c: cccrcccgcwcchccccdcc",
    "7-14 l: lllllllllllllcsl",
    "12-14 p: jlmhpjgdzjkpnbmnbk",
    "17-18 n: nnnnnnnnnnnnnnnnqv",
    "8-10 b: lqzrtbzbrb",
    "8-11 x: xgxxfxxxxkxx",
    "5-9 x: xxxsnxnxk",
    "2-11 t: stxbxwssmgthttx",
    "6-13 t: ktbktrtqcnlrgtvtwt",
    "10-12 q: qqqqqqqqqrqq",
    "14-15 q: znptzmgllrfrqrf",
    "2-13 f: ffffffcffffff",
    "9-10 h: hrbhnhhhhhhhh",
    "8-14 k: lskskkkfzkkkkmkkm",
    "1-3 g: kbmswhmghvwvnwxzzk",
    "2-4 v: vttv",
    "2-3 h: qhhmhghbh",
    "6-13 t: ttgtttttktttdttt",
    "7-9 v: vvrrvvvvvv",
    "5-6 z: hcfwdr",
    "5-13 g: sgmgggcggggggjrggggk",
    "10-14 k: kzkkkkkkdskkktkkk",
    "1-2 j: ptjj",
    "4-11 b: xnbbbbnbbbb",
    "14-16 b: bbbbbbbbbbbbbkbc",
    "4-12 w: mwrwrcpwkpzwxrj",
    "5-6 l: qlndzlcvw",
    "1-2 s: ksxk",
    "4-5 p: spgwql",
    "7-10 j: ljjjjvxjhzjjjjrj",
    "6-14 f: ffffffffffffff",
    "11-15 d: ddddddddddzdpdn",
    "3-5 t: ttmtz",
    "6-7 x: kxvxxxx",
    "3-6 m: mhmklm",
    "4-8 h: bnhjhphgqxphpnthh",
    "3-4 w: gwpq",
    "10-13 t: ttvttjhttcttrtthtb",
    "1-5 f: ffffg",
    "6-14 v: rtjjvpbvnvjwlvktvvf",
    "8-9 n: nnknnnxmnnn",
    "9-10 v: vvsvvsvvqcvvpp",
    "9-11 x: xxxxxxxxxwl",
    "3-6 h: bwqxnrhkhhwhhh",
    "4-8 l: lvllrlcf",
    "1-2 m: gtrm",
    "2-4 z: zzzz",
    "6-7 j: jjjjjjj",
    "15-16 g: sggggggggqgclgggmggw",
    "7-9 v: dvmskjsczkvjcpsv",
    "3-11 d: hmdrdfdqrddzdddjdd",
    "7-9 m: mmmwfmmmtmm",
    "6-8 x: lxsbxmlx",
    "3-5 q: qqqxq",
    "5-10 n: nnnnznnnnrn",
    "4-6 m: zmmbzg",
    "10-11 c: cpdndvlfltc",
    "2-4 k: kzkkk",
    "1-14 m: jmmmmmzmqtmsmmnmm",
    "3-13 h: gwhhrlbstldmh",
    "2-5 l: rrlhdqkzst",
    "1-6 s: sqgsjs",
    "3-4 h: hhgpb",
    "11-16 l: llllllllllllllwkllll",
    "7-11 j: gjjjtvhjjpj",
    "14-15 h: hjjvmbhfjhhxkbh",
    "1-2 t: rwxgz",
    "13-18 p: pppppppppppppppppppp",
    "1-14 x: xxrxxjxhxxxxxxbxxx",
    "4-6 b: fbzsbpbbb",
    "12-16 j: fjjgmnjwbvhjzzzs",
    "6-7 m: mmmmmtq",
    "12-16 n: nnmnnpnnnnnknqxkjnjn",
    "5-8 w: wmwwwwpwlwllzwkcw",
    "7-10 q: gbpsnqwqfm",
    "10-13 x: vxxxxxxxxxdqnxx",
    "7-12 q: qqqqqqqqqqqqqqq",
    "1-2 n: snnn",
    "6-10 l: lljllklllwp",
    "3-4 b: bsnjzbb",
    "13-14 g: tggztfgdggngmglgg",
    "6-16 l: bkcwjlwcnfwthlll",
    "8-11 s: sssssssvsss",
    "3-4 k: xmthtrcx",
    "7-8 h: wpmjhbgg",
    "4-5 p: pcpkvp",
    "14-15 s: ssrssssssssssjs",
    "14-15 x: xxxzxxgxxtxxxxqx",
    "6-7 m: nwmfmxmm",
    "6-8 k: hsknkmvhkgkkfzkjf",
    "4-5 s: sssms",
    "7-9 g: gfgqldxgxdjzglcgg",
    "10-11 k: ckkthkzpdrfv",
    "1-14 p: jptppkcppjpppppppp",
    "10-11 x: pxkccxpxdsq",
    "2-8 x: xsgxxxxvgxxk",
    "6-14 j: jjjjjzjjjjjjjtjjjj",
    "7-10 x: rxxnxrzgxxd",
    "6-12 g: dmgggpgggwczggghggm",
    "3-6 h: hdhjhhhhchh",
    "11-12 r: zrrkcrrrrrlh",
    "7-9 v: vhqvlvwvzqwqvrxvjnf",
    "1-5 r: rvmjr"
];

const isValid = (passwordRow) => {
    let ruleString = "";
    let password = "";
    [ruleString, password] = passwordRow.split(": ");

    let timesRange = "";
    let letter = "";
    let minTimes = 0;
    let maxTimes = 0;
    [ timesRange, letter ] = ruleString.split(" ");
    [ minTimes, maxTimes ] = timesRange.split("-");

    let counter = 0;
    for(let i = 0; i < password.length; i++)
        if (password.charAt(i) === letter) counter++;

    return counter <= Number.parseInt(maxTimes) 
        && counter >= Number.parseInt(minTimes);
}

let valids = 0;
for(let i = 0; i < input.length; i++) {
    isValid(input[i]) ? valids++ : 0;
}
console.log(`... part 1 answer is ${valids}`);

const isValidPart2 = (passwordRow) => {
    let ruleString = "";
    let password = "";
    [ruleString, password] = passwordRow.split(": ");

    let timesRange = "";
    let letter = "";
    [ timesRange, letter ] = ruleString.split(" ");
    places = timesRange.split("-").map(e => Number.parseInt(e));

    let counter = 0;
    for(let place of places)
        if (password.charAt(place - 1) === letter) counter++;

    return counter === 1;
}

valids = 0;
for(let i = 0; i < input.length; i++) {
    isValidPart2(input[i]) ? valids++ : 0;
}
console.log(`... part 2 answer is ${valids}`);
