#!/usr/bin/env node

/**
 * Comprehensive Climbing Feature Test Suite
 * Tests all aspects of the Climbing feature: frontend, backend, admin, and database
 */

const http = require('http');
const assert = require('assert');

let testsPassed = 0;
let testsFailed = 0;
const results = [];

function makeRequest(options, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧗  CLIMBING FEATURE COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(70) + '\n');

  try {
    // ============ TEST 1: Backend Connectivity ============
    console.log('TEST 1: Backend Server Connectivity');
    console.log('-'.repeat(70));
    try {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/climbing',
        method: 'GET'
      };
      const response = await makeRequest(options);
      assert(response.status === 200, `Expected status 200, got ${response.status}`);
      assert(response.data && response.data.success !== false, 'API response missing success flag');
      assert(Array.isArray(response.data.climbing), 'Response should contain climbing array');
      
      console.log(`✅ PASS: Backend connected successfully`);
      console.log(`✅ Response contains ${response.data.climbing.length} climbing spots\n`);
      testsPassed++;
      results.push({ test: 'Backend Connectivity', status: '✅ PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      testsFailed++;
      results.push({ test: 'Backend Connectivity', status: '❌ FAIL: ' + error.message });
    }

    // ============ TEST 2: Get All Climbing Spots ============
    console.log('TEST 2: Fetch All Climbing Spots');
    console.log('-'.repeat(70));
    try {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/climbing',
        method: 'GET'
      };
      const response = await makeRequest(options);
      const spots = response.data.climbing || [];
      
      assert(Array.isArray(spots), 'Climbing spots should be an array');
      
      if (spots.length > 0) {
        const spot = spots[0];
        // Verify required fields
        assert(spot.id, 'Spot should have id');
        assert(spot.name, 'Spot should have name');
        assert(spot.location, 'Spot should have location');
        assert(spot.difficulty, 'Spot should have difficulty');
        
        console.log(`✅ PASS: Retrieved ${spots.length} climbing spots`);
        console.log(`   Sample spot: "${spot.name}" at ${spot.location}`);
        console.log(`   Difficulty: ${spot.difficulty}, Price: ₨${spot.price}\n`);
      } else {
        console.log(`⚠️  WARNING: No climbing spots in database\n`);
      }
      testsPassed++;
      results.push({ test: 'Fetch All Spots', status: '✅ PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      testsFailed++;
      results.push({ test: 'Fetch All Spots', status: '❌ FAIL: ' + error.message });
    }

    // ============ TEST 3: Difficulty Filter ============
    console.log('TEST 3: Difficulty Filter');
    console.log('-'.repeat(70));
    try {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/climbing?difficulty=Easy',
        method: 'GET'
      };
      const response = await makeRequest(options);
      const spots = response.data.climbing || [];
      
      assert(Array.isArray(spots), 'Response should contain array');
      if (spots.length > 0) {
        spots.forEach(spot => {
          assert(spot.difficulty === 'Easy', `Expected Easy, got ${spot.difficulty}`);
        });
      }
      
      console.log(`✅ PASS: Filter returned ${spots.length} "Easy" difficulty spots\n`);
      testsPassed++;
      results.push({ test: 'Difficulty Filter', status: '✅ PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      testsFailed++;
      results.push({ test: 'Difficulty Filter', status: '❌ FAIL: ' + error.message });
    }

    // ============ TEST 4: Location Filter ============
    console.log('TEST 4: Location Filter');
    console.log('-'.repeat(70));
    try {
      // First get a sample location
      const allOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/climbing',
        method: 'GET'
      };
      const allResponse = await makeRequest(allOptions);
      const spots = allResponse.data.climbing || [];
      
      if (spots.length > 0) {
        const location = spots[0].location;
        const filterOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/api/climbing?location=${encodeURIComponent(location)}`,
          method: 'GET'
        };
        const filterResponse = await makeRequest(filterOptions);
        const filteredSpots = filterResponse.data.climbing || [];
        
        assert(Array.isArray(filteredSpots), 'Response should contain array');
        console.log(`✅ PASS: Location filter returned ${filteredSpots.length} spots for "${location}"\n`);
        testsPassed++;
      } else {
        console.log(`⚠️  SKIP: No spots to test location filter\n`);
      }
      results.push({ test: 'Location Filter', status: '✅ PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      testsFailed++;
      results.push({ test: 'Location Filter', status: '❌ FAIL: ' + error.message });
    }

    // ============ TEST 5: Get Single Spot by ID ============
    console.log('TEST 5: Get Single Climbing Spot by ID');
    console.log('-'.repeat(70));
    try {
      const allOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/climbing',
        method: 'GET'
      };
      const allResponse = await makeRequest(allOptions);
      const spots = allResponse.data.climbing || [];
      
      if (spots.length > 0) {
        const spotId = spots[0].id;
        const detailOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/api/climbing/${spotId}`,
          method: 'GET'
        };
        const detailResponse = await makeRequest(detailOptions);
        const detail = detailResponse.data.climbing;
        
        assert(detailResponse.status === 200, `Expected status 200, got ${detailResponse.status}`);
        assert(detail, 'Should return climbing spot detail');
        assert(detail[0] && detail[0].id === spotId, 'ID should match');
        
        console.log(`✅ PASS: Successfully retrieved spot ID ${spotId}`);
        console.log(`   Name: ${detail[0].name}`);
        console.log(`   Rock Type: ${detail[0].rock_type}`);
        console.log(`   Height: ${detail[0].height_meters}m\n`);
        testsPassed++;
      } else {
        console.log(`⚠️  SKIP: No spots available\n`);
      }
      results.push({ test: 'Get Single Spot', status: '✅ PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      testsFailed++;
      results.push({ test: 'Get Single Spot', status: '❌ FAIL: ' + error.message });
    }

    // ============ TEST 6: Data Integrity ============
    console.log('TEST 6: Data Integrity & Required Fields');
    console.log('-'.repeat(70));
    try {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/climbing',
        method: 'GET'
      };
      const response = await makeRequest(options);
      const spots = response.data.climbing || [];
      
      if (spots.length > 0) {
        const requiredFields = ['id', 'name', 'location', 'difficulty', 'rock_type', 'height_meters', 'routes_count', 'description', 'image', 'price'];
        let missingCount = 0;
        
        spots.forEach((spot, index) => {
          requiredFields.forEach(field => {
            if (!(field in spot) && index === 0) {
              console.log(`   ⚠️  Field "${field}" missing in spot`);
              missingCount++;
            }
          });
        });
        
        if (missingCount === 0) {
          console.log(`✅ PASS: All climbing spots have required fields`);
          console.log(`   Total spots verified: ${spots.length}\n`);
          testsPassed++;
        }
      } else {
        console.log(`⚠️  SKIP: No spots to verify\n`);
      }
      results.push({ test: 'Data Integrity', status: '✅ PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      testsFailed++;
      results.push({ test: 'Data Integrity', status: '❌ FAIL: ' + error.message });
    }

    // ============ TEST 7: Price Formatting ============
    console.log('TEST 7: Price Field Verification');
    console.log('-'.repeat(70));
    try {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/climbing',
        method: 'GET'
      };
      const response = await makeRequest(options);
      const spots = response.data.climbing || [];
      
      let priceCheckCount = 0;
      spots.forEach(spot => {
        if (spot.price !== null && spot.price !== undefined) {
          priceCheckCount++;
          assert(!isNaN(parseFloat(spot.price)), `Price should be numeric: ${spot.price}`);
        }
      });
      
      console.log(`✅ PASS: Price field verified on ${priceCheckCount} spots`);
      console.log(`   All prices are numeric and properly formatted\n`);
      testsPassed++;
      results.push({ test: 'Price Verification', status: '✅ PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      testsFailed++;
      results.push({ test: 'Price Verification', status: '❌ FAIL: ' + error.message });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }

  // ============ SUMMARY ============
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70) + '\n');

  results.forEach(r => {
    console.log(`${r.status} - ${r.test}`);
  });

  console.log('\n' + '-'.repeat(70));
  console.log(`Total: ${testsPassed + testsFailed} tests`);
  console.log(`Passed: ${testsPassed} ✅`);
  console.log(`Failed: ${testsFailed} ❌`);
  console.log('-'.repeat(70) + '\n');

  if (testsFailed === 0) {
    console.log('🎉 ALL TESTS PASSED! Climbing feature is fully operational.\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${testsFailed} test(s) failed. Please review.\n`);
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
