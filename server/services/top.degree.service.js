export default class TopDegreeService {
    /**
     * @type {neo4j.Driver}
     */
    driver;
  
    /**
     * The constructor expects an instance of the Neo4j Driver, which will be
     * used to interact with Neo4j.
     *
     * @param {neo4j.Driver} driver
     */
    constructor(driver) {
      this.driver = driver;
    }
  
    async getTopDegree(k) {
      const session = this.driver.session();
      const res = await session.executeRead((tx) =>
        tx.run(
          `
          MATCH (n)-[r:ProPro]-(g)
          WITH n,count(n) as degree
          ORDER BY degree DESC LIMIT toInteger($k)
          RETURN n
            `,
          {
            k: k,
          }
        )
      );
  
      const nodes = res.records;
  
      await session.close();
  
      //return nodes;
      return res.records.map((record) => record.get('n'));
    }
  }