module.exports = {
  dev: {
    migrationStorageTableName: 'Migrations',
    dialect: 'postgres',
    // host: 'localhost',
    // port: 5432,
    // username: 'postgres',
    // password: 'vmnvmn3110',
    // database: 'postgres',
    host: 'pg-20a86af4-vominhnhut31102002-9e04.g.aivencloud.com',
    port: 14057,
    username: 'avnadmin',
    password: 'AVNS_1XOiD_iiYcLpRm1bjao',
    database: 'defaultdb',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUNSpJLHZlkc36c11riyTNwlG0KVQwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNWEwYmRmOWItYjllZS00NjcwLTliM2ItYjBjNTEyMjhj
YTQ4IFByb2plY3QgQ0EwHhcNMjQwNTE1MDg0NjEzWhcNMzQwNTEzMDg0NjEzWjA6
MTgwNgYDVQQDDC81YTBiZGY5Yi1iOWVlLTQ2NzAtOWIzYi1iMGM1MTIyOGNhNDgg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAJ6sgLo3
pG9FqH3pTREBtSLtgL/yuZ1Q60ew5DRbujBGXxSgDzgxmGEg2ZiZy+zTH7CBZ5f3
TUgLWrRI8syi0bam6fXOvWIMVHtLuqxmtJbv1qUP3Ov020vifcaouycO1RTk6nJU
Ker2g6CsvyqkKjImpbpnzBvkmQ3MdzoFPcKOmr/bY/qX6eEQ6lx+IklKGegCGSKp
vIL7G3TzxzQJyJ6OHiF0iVJIGn9kTGqfc3HVlkPYYsSFDQHV44O3fDdhE5ZZK4KO
KIV9N5EMCSVig6D/mR+SwSy9qe8s6eDES25s3XaorD1kdDXJyIvuhhp5UqQuLGoV
KrUtNo2DFBWCULs4jwS+08nWvLtsfPXsyv/BnPMVCOVxkZhFc8IwjHcD9FuIPls1
Yo2ZUMJsnP1ksfuSyLR+qDvvhV9QSgJoDVwMOL6ddzmgY1jgpU0t1BRg1lDHJyKk
AEQ8XmHxbjO3SWKTjSxcNsS5B4mWQNfPDdtU1nBqnvRIAJEnT9cMMHOkCQIDAQAB
oz8wPTAdBgNVHQ4EFgQUDnJKaJv8AfjRqRPuR9bx7IpjEAswDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAC2c7lSckgZEp/is
YwagKub7h2lb5DdNgi7euN8cIKFa8KZIrG8vVDez02nTZmbjit3tVBFn2EOxNRXs
Ho2fnR6NvN/xD3DtjSkpKkxHFHQB/S8BJ96tVurKMeh7pzvJMJrZjIhL+k8MMzgN
g8bQJISQSo5tEEshn6iaJ6a/2K6ba9mzhqge5VZGOkAQn1OXARP3zp273zxxf/BY
N1zonxh7Mfp6JbkWVN1ngn5ntS4j4tsITkay6ILvDZBZ8u9+eWwGP4J8cd1BhNA1
XQIt7evr/zZ1aiyJ7/eLmgIKkh7eP/52cc5tb3V6v1Z9K6X0vPe2sGoZ0viA6exu
c76ILMiRrToxZAJ/twFTeehHDM6UDbp+zcQGHXYSRhAr1TCsr/UlIppozPVAlbGn
bxvhxd+QA1U2FlxeukeCvCaJkuCj7vmyfHFWZuHrQs1/cskhulSjOlCIrCEXVo3Y
p/S/jxYk9y7E881tC14F4hvWbqSGrDOw48ObOKACub9EG3Uvug==
-----END CERTIFICATE-----`,
      },
    },
  },
};
