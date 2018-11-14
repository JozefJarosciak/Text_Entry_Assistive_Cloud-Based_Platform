SELECT  
	 (SELECT count(DISTINCT(email)) FROM teapresults) AS 'Number of Test Subjects',
    (SELECT COUNT(*) FROM teapresults) AS 'Total Test Cases',
    (SELECT count(testtype) FROM teapresults WHERE testtype=1) AS 'Tests #1',
    (SELECT count(testtype) FROM teapresults WHERE testtype=2) AS 'Tests #2',
    (SELECT count(testtype) FROM teapresults WHERE testtype=3) AS 'Tests #3',
    (SELECT SEC_TO_TIME(SUM(secondstocomplete)/count(testtype)) FROM teapresults WHERE testtype = 1) AS 'Avg. Time Test #1 (no assist)',
    (SELECT SEC_TO_TIME(SUM(secondstocomplete)/count(testtype)) FROM teapresults WHERE testtype = 2) AS 'Avg. Time Test #2 (assisted)',
    (SELECT SEC_TO_TIME(SUM(secondstocomplete)/count(testtype)) FROM teapresults WHERE testtype = 3) AS 'Avg. Time Test #3 (creative)'