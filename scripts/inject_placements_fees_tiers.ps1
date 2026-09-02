$jsonPath = "f:\AYUS Labs\InfoColl\src\lib\colleges.generated.json"
$data = Get-Content -Raw $jsonPath | ConvertFrom-Json

$meta = @{
    # Pune
    "pune-coep" = @{ tier = 1; avg = 12.0; high = 52.0; recs = @("Microsoft", "Google", "DE Shaw", "Texas Instruments", "Bajaj Auto"); fee = 85000; feeType = "Govt. Subsidized" };
    "pune-pict" = @{ tier = 1; avg = 12.8; high = 47.2; recs = @("PhonePe", "Microsoft", "Arista Networks", "Mastercard", "Amazon"); fee = 110000; feeType = "FRA Approved" };
    "pune-cummins" = @{ tier = 1; avg = 10.2; high = 44.0; recs = @("Microsoft", "Cisco", "Goldman Sachs", "Intuit", "Walmart"); fee = 178000; feeType = "FRA Approved" };
    "pune-vit" = @{ tier = 1; avg = 7.8; high = 44.0; recs = @("Nvidia", "Infosys", "Barclays", "Siemens", "TCS Digital"); fee = 192000; feeType = "FRA Approved" };
    "pune-pccoe" = @{ tier = 1; avg = 6.5; high = 38.0; recs = @("Adobe", "Dassault Systèmes", "Capgemini", "KPIT", "Cognizant"); fee = 138000; feeType = "FRA Approved" };
    "pune-aissms" = @{ tier = 2; avg = 4.8; high = 18.0; recs = @("TCS", "Godrej", "L&T", "Tech Mahindra", "Johnson Controls"); fee = 132000; feeType = "FRA Approved" };
    "pune-dypatil" = @{ tier = 2; avg = 5.2; high = 24.0; recs = @("TCS", "Wipro", "Capgemini", "Virtusa", "Bitwise"); fee = 135000; feeType = "FRA Approved" };
    "pune-mmcoe" = @{ tier = 2; avg = 4.5; high = 16.0; recs = @("Hexaware", "Persistent", "TCS", "Cognizant", "Zensar"); fee = 115000; feeType = "FRA Approved" };
    "pune-jscoe" = @{ tier = 3; avg = 4.0; high = 14.0; recs = @("TCS", "Infosys", "Wipro", "Capgemini"); fee = 108000; feeType = "FRA Approved" };
    "pune-scoe" = @{ tier = 2; avg = 4.5; high = 18.0; recs = @("Accenture", "Cognizant", "Infosys", "Capgemini"); fee = 118000; feeType = "FRA Approved" };
    "pune-zcoer" = @{ tier = 3; avg = 3.8; high = 12.0; recs = @("TCS", "Tech Mahindra", "Syntel", "Amazon"); fee = 98000; feeType = "FRA Approved" };
    "pune-trinity" = @{ tier = 3; avg = 3.5; high = 10.0; recs = @("TCS", "Infosys", "Zensar", "Dhoot Transmission"); fee = 88000; feeType = "FRA Approved" };
    "pune-apcoe" = @{ tier = 3; avg = 3.5; high = 10.0; recs = @("TCS", "Capgemini", "Atos", "Neilsoft"); fee = 82000; feeType = "FRA Approved" };
    "pune-ghrcem" = @{ tier = 3; avg = 4.2; high = 15.0; recs = @("TCS", "Cognizant", "Capgemini", "Tech Mahindra"); fee = 110000; feeType = "FRA Approved" };
    "pune-nbn" = @{ tier = 3; avg = 3.8; high = 12.0; recs = @("Accenture", "Infosys", "Cognizant", "TCS"); fee = 96000; feeType = "FRA Approved" };
    "pune-mitwpu" = @{ tier = 2; avg = 7.2; high = 44.1; recs = @("Amazon", "Microsoft", "IBM", "Infosys", "Rakuten"); fee = 325000; feeType = "Private University" };
    "pune-viit" = @{ tier = 2; avg = 6.8; high = 34.0; recs = @("Infosys", "TCS", "Cognizant", "Barclays", "Nvidia"); fee = 180000; feeType = "FRA Approved" };
    "pune-alard" = @{ tier = 3; avg = 3.2; high = 8.0; recs = @("TCS", "Wipro", "Tech Mahindra", "Local IT"); fee = 85000; feeType = "FRA Approved" };

    # Mumbai
    "mumbai-vjti" = @{ tier = 1; avg = 14.5; high = 62.0; recs = @("Google", "Morgan Stanley", "Microsoft", "Texas Instruments", "Citi"); fee = 84051; feeType = "Govt. Subsidized" };
    "mumbai-spit" = @{ tier = 1; avg = 15.2; high = 42.0; recs = @("Microsoft", "Morgan Stanley", "JP Morgan", "PhonePe", "Oracle"); fee = 172000; feeType = "FRA Approved" };
    "mumbai-ict" = @{ tier = 1; avg = 9.5; high = 30.0; recs = @("ExxonMobil", "Reliance", "BASF", "Unilever", "Pidilite"); fee = 89100; feeType = "Govt. Deemed Univ." };
    "mumbai-djsanghvi" = @{ tier = 1; avg = 11.1; high = 45.0; recs = @("Amazon", "JP Morgan", "Morgan Stanley", "Cisco", "Bloomberg"); fee = 221000; feeType = "FRA Approved" };
    "mumbai-tsec" = @{ tier = 2; avg = 8.5; high = 36.0; recs = @("Morgan Stanley", "JP Morgan", "Amdocs", "TCS", "Deutsche Bank"); fee = 195000; feeType = "FRA Approved" };
    "mumbai-crce" = @{ tier = 2; avg = 7.5; high = 25.0; recs = @("JP Morgan", "TCS", "LTI", "Godrej", "Capgemini"); fee = 165000; feeType = "FRA Approved" };
    "mumbai-vidyalankar" = @{ tier = 2; avg = 5.5; high = 37.5; recs = @("Reliance Jio", "TCS", "Capgemini", "LTIMindtree"); fee = 152000; feeType = "FRA Approved" };
    "mumbai-atharva" = @{ tier = 3; avg = 4.2; high = 15.0; recs = @("TCS", "Wipro", "Infosys", "Tech Mahindra"); fee = 130000; feeType = "FRA Approved" };
    "mumbai-sies" = @{ tier = 2; avg = 5.8; high = 22.0; recs = @("TCS", "Cognizant", "LTI", "Jio", "Capgemini"); fee = 140000; feeType = "FRA Approved" };
    "mumbai-terna" = @{ tier = 2; avg = 4.5; high = 18.0; recs = @("TCS", "Infosys", "Reliance", "Capgemini"); fee = 125000; feeType = "FRA Approved" };
    "mumbai-rgit" = @{ tier = 3; avg = 4.5; high = 16.0; recs = @("TCS", "LTI", "Cognizant", "Capgemini"); fee = 122000; feeType = "FRA Approved" };
    "mumbai-sfit" = @{ tier = 2; avg = 5.8; high = 24.0; recs = @("TCS", "Infosys", "Capgemini", "LTI", "Persistent"); fee = 135000; feeType = "FRA Approved" };
    "mumbai-donbosco" = @{ tier = 2; avg = 5.5; high = 20.0; recs = @("TCS", "JP Morgan", "Capgemini", "LTI"); fee = 132000; feeType = "FRA Approved" };
    "mumbai-pillai" = @{ tier = 3; avg = 4.0; high = 14.0; recs = @("TCS", "Infosys", "Tech Mahindra", "Capgemini"); fee = 105000; feeType = "FRA Approved" };
    "mumbai-kjsomaiya" = @{ tier = 1; avg = 10.4; high = 58.0; recs = @("Barclays", "Cisco", "Microsoft", "Morgan Stanley", "JPMC"); fee = 450000; feeType = "Private University" };
    "mumbai-mpstme" = @{ tier = 1; avg = 9.8; high = 42.0; recs = @("Amazon", "Microsoft", "PwC", "EY", "Nomura"); fee = 350000; feeType = "Deemed University" };

    # Nagpur
    "nagpur-vnit" = @{ tier = 1; avg = 11.9; high = 64.0; recs = @("Google", "Microsoft", "Goldman Sachs", "Samsung", "Qualcomm"); fee = 149000; feeType = "Institute of Nat. Importance" };
    "nagpur-iiit" = @{ tier = 1; avg = 14.0; high = 86.0; recs = @("Nvidia", "AlphaGrep", "Cisco", "Amazon", "Siemens"); fee = 238000; feeType = "Institute of Nat. Importance" };
    "nagpur-rcoem" = @{ tier = 1; avg = 6.8; high = 48.0; recs = @("Amazon", "VMware", "Infosys", "Accenture", "Persistent"); fee = 175000; feeType = "Autonomous / Private Univ." };
    "nagpur-ycce" = @{ tier = 2; avg = 5.2; high = 22.0; recs = @("TCS", "Wipro", "Capgemini", "Cognizant", "Persistent"); fee = 145000; feeType = "FRA Approved" };
    "nagpur-ghrce" = @{ tier = 2; avg = 4.8; high = 18.0; recs = @("TCS", "Tech Mahindra", "Wipro", "Capgemini", "Persistent"); fee = 150000; feeType = "FRA Approved" };
    "nagpur-gcoen" = @{ tier = 2; avg = 4.5; high = 14.0; recs = @("TCS", "Adani", "L&T", "Infosys", "Cognizant"); fee = 24500; feeType = "Govt. Subsidized" };
    "nagpur-anjuman" = @{ tier = 3; avg = 3.5; high = 10.0; recs = @("TCS", "Wipro", "Tech Mahindra", "Dhoot"); fee = 88000; feeType = "FRA Approved" };
    "nagpur-kdk" = @{ tier = 3; avg = 3.6; high = 11.0; recs = @("TCS", "Infosys", "Capgemini", "Tech Mahindra"); fee = 96000; feeType = "FRA Approved" };
    "nagpur-srpce" = @{ tier = 3; avg = 3.0; high = 7.0; recs = @("TCS", "Local Tech", "Genpact"); fee = 72000; feeType = "FRA Approved" };
    "nagpur-tgpcet" = @{ tier = 3; avg = 3.5; high = 10.0; recs = @("TCS", "Infosys", "Wipro", "Dhoot Transmission"); fee = 95000; feeType = "FRA Approved" };
    "nagpur-jdcoem" = @{ tier = 3; avg = 3.4; high = 9.0; recs = @("TCS", "Tech Mahindra", "Capgemini"); fee = 92000; feeType = "FRA Approved" };
    "nagpur-gniet" = @{ tier = 3; avg = 3.2; high = 8.0; recs = @("TCS", "Wipro", "Tech Mahindra"); fee = 78000; feeType = "FRA Approved" };
    "nagpur-nit" = @{ tier = 3; avg = 3.3; high = 8.5; recs = @("TCS", "Infosys", "Capgemini"); fee = 82000; feeType = "FRA Approved" };
    "nagpur-scet" = @{ tier = 3; avg = 3.2; high = 8.0; recs = @("TCS", "Tech Mahindra", "Jayswal Neco"); fee = 75000; feeType = "FRA Approved" };
    "nagpur-svpcet" = @{ tier = 2; avg = 4.6; high = 14.0; recs = @("TCS", "Infosys", "Capgemini", "Persistent"); fee = 115000; feeType = "FRA Approved" };
    "nagpur-sbjit" = @{ tier = 2; avg = 4.5; high = 20.0; recs = @("TCS", "Persistent", "Capgemini", "Cognizant"); fee = 112000; feeType = "FRA Approved" };
    "nagpur-pbcoe" = @{ tier = 3; avg = 3.3; high = 8.0; recs = @("TCS", "Wipro", "Tech Mahindra"); fee = 85000; feeType = "FRA Approved" };
    "nagpur-wcem" = @{ tier = 3; avg = 3.0; high = 7.0; recs = @("TCS", "Wipro", "Genpact"); fee = 70000; feeType = "FRA Approved" };
    "nagpur-pce" = @{ tier = 2; avg = 4.2; high = 15.0; recs = @("TCS", "Infosys", "Cognizant", "Capgemini"); fee = 110000; feeType = "FRA Approved" };
    "nagpur-pjlce" = @{ tier = 3; avg = 3.2; high = 8.0; recs = @("TCS", "Infosys", "Wipro"); fee = 75000; feeType = "FRA Approved" };

    # Amravati
    "amravati-gcoea" = @{ tier = 1; avg = 5.4; high = 18.0; recs = @("TCS", "Cognizant", "Wipro", "L&T", "Adani Group"); fee = 25000; feeType = "Govt. Subsidized" };
    "amravati-prmitr" = @{ tier = 2; avg = 4.1; high = 12.5; recs = @("TCS", "Cognizant", "Capgemini", "Tech Mahindra"); fee = 95000; feeType = "FRA Approved" };
    "amravati-prpote" = @{ tier = 2; avg = 3.8; high = 10.0; recs = @("TCS", "Wipro", "Capgemini", "Amazon Recruiting"); fee = 88000; feeType = "FRA Approved" };
    "amravati-sipna" = @{ tier = 2; avg = 4.0; high = 11.5; recs = @("TCS", "Cognizant", "Persistent", "Hexaware"); fee = 92000; feeType = "FRA Approved" };
    "amravati-mngm" = @{ tier = 3; avg = 3.5; high = 9.0; recs = @("TCS", "Wipro", "Infosys", "Collabera"); fee = 80000; feeType = "FRA Approved" };
    "amravati-hvpm" = @{ tier = 3; avg = 3.4; high = 8.5; recs = @("TCS", "Tech Mahindra", "Reliance", "Genpact"); fee = 75000; feeType = "FRA Approved" };
    "amravati-drgitr" = @{ tier = 3; avg = 3.2; high = 7.0; recs = @("Mass Recruiters", "Local Vendors"); fee = 68000; feeType = "FRA Approved" }
}

$updatedCount = 0
foreach ($cityKey in $data.cities.PSObject.Properties.Name) {
    $city = $data.cities.$cityKey
    foreach ($col in $city.colleges) {
        $info = $meta[$col.id]
        if ($null -ne $info) {
            $col | Add-Member -NotePropertyName "tier" -NotePropertyValue $info.tier -Force
            $placementObj = [PSCustomObject]@{
                avgPackage = [double]$info.avg
                highestPackage = [double]$info.high
                topRecruiters = [string[]]$info.recs
            }
            $col | Add-Member -NotePropertyName "placement" -NotePropertyValue $placementObj -Force

            $feeObj = [PSCustomObject]@{
                totalAnnualFee = [int]$info.fee
                feeType = [string]$info.feeType
            }
            $col | Add-Member -NotePropertyName "feeStructure" -NotePropertyValue $feeObj -Force

            $updatedCount++
        } else {
            Write-Warning "No metadata found for college: $($col.id)"
        }
    }
}

$data | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath -Encoding utf8
Write-Host "Successfully enriched $updatedCount colleges in $jsonPath"
