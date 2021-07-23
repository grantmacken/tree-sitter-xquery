declare namespace env="http://www.w3.org/2003/05/soap-envelope";
declare context item as element(env:Envelope) external;
declare context item as element(sys:log) external := doc("/var/xlogs/sysevent.xml")/sys:log; 


