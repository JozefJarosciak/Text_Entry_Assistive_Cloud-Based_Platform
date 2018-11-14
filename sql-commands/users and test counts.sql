SELECT email, count( teapresults.email ) 
FROM teapresults 
GROUP BY email 
ORDER BY count( teapresults.email ) 