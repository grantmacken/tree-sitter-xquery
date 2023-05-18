'3.16 Quantified Expressions',
every $part in /parts/part satisfies $part/@discounted,
some $emp in /emps/employee satisfies
     ($emp/bonus > 0.25 * $emp/salary),
some $x in (1, 2, "cat") satisfies $x * 2 = 4


