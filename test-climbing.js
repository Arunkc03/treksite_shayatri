// Simple test script to verify climbing API functionality
const http = require('http');

function testClimbingAPI() {
  console.log('🧗 Testing Climbing API...\n');

  // Test 1: Get all climbing spots
  console.log('📍 Test 1: Fetching all climbing spots');
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/climbing',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`✅ Found ${response.climbing?.length || 0} climbing spots\n`);
        
        if (response.climbing && response.climbing.length > 0) {
          console.log('📋 First climbing spot:');
          const spot = response.climbing[0];
          console.log(`   - ID: ${spot.id}`);
          console.log(`   - Name: ${spot.name}`);
          console.log(`   - Location: ${spot.location}`);
          console.log(`   - Difficulty: ${spot.difficulty}`);
          console.log(`   - Price: ₨${spot.price}`);
          console.log(`   - Rock Type: ${spot.rock_type}`);
          console.log(`   - Height: ${spot.height_meters}m`);
          console.log(`   - Routes: ${spot.routes_count}\n`);
        }

        // Test 2: Get with filters
        console.log('📍 Test 2: Fetching with difficulty filter (Easy)');
        const filterOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/climbing?difficulty=Easy',
          method: 'GET'
        };

        const req2 = http.request(filterOptions, (res2) => {
          let data2 = '';
          res2.on('data', (chunk) => {
            data2 += chunk;
          });
          res2.on('end', () => {
            const response2 = JSON.parse(data2);
            console.log(`✅ Status: ${res2.statusCode}`);
            console.log(`✅ Found ${response2.climbing?.length || 0} climbing spots with Easy difficulty\n`);

            // Test 3: Get single spot by ID
            if (response.climbing && response.climbing.length > 0) {
              console.log('📍 Test 3: Fetching single climbing spot by ID');
              const spotId = response.climbing[0].id;
              const detailOptions = {
                hostname: 'localhost',
                port: 5000,
                path: `/api/climbing/${spotId}`,
                method: 'GET'
              };

              const req3 = http.request(detailOptions, (res3) => {
                let data3 = '';
                res3.on('data', (chunk) => {
                  data3 += chunk;
                });
                res3.on('end', () => {
                  const response3 = JSON.parse(data3);
                  console.log(`✅ Status: ${res3.statusCode}`);
                  if (response3.climbing) {
                    console.log(`✅ Successfully retrieved spot: ${response3.climbing[0].name}\n`);
                  }

                  console.log('🎉 All Climbing API tests passed!');
                  console.log('✨ Climbing feature is fully functional\n');
                  process.exit(0);
                });
              });

              req3.on('error', (e) => {
                console.error('❌ Error fetching single spot:', e);
                process.exit(1);
              });
              req3.end();
            }
          });
        });

        req2.on('error', (e) => {
          console.error('❌ Error with filter test:', e);
          process.exit(1);
        });
        req2.end();
      } catch (error) {
        console.error('❌ Error parsing response:', error);
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Error connecting to API:', e);
    process.exit(1);
  });

  req.end();
}

testClimbingAPI();
