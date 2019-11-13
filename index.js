"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
class LLCoopApi extends cdk.Stack {
    constructor(app, id) {
        super(app, id);
        const checkedOutResources = new lambda.Function(this, 'checkedOutResourcesFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'checked-out-resources.handler',
            runtime: lambda.Runtime.NODEJS_10_X,
        });
        const api = new apigateway.RestApi(this, 'llcoopApi', {
            restApiName: 'Lakeland Library Cooperative API'
        });
        const items = api.root.addResource('items');
        const getAllIntegration = new apigateway.LambdaIntegration(checkedOutResources);
        items.addMethod('POST', getAllIntegration);
    }
}
exports.LLCoopApi = LLCoopApi;
function addCorsOptions(apiResource) {
    apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
        integrationResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "'false'",
                    'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
                },
            }],
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
        },
    }), {
        methodResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Credentials': true,
                    'method.response.header.Access-Control-Allow-Origin': true,
                },
            }]
    });
}
exports.addCorsOptions = addCorsOptions;
const app = new cdk.App();
new LLCoopApi(app, 'LLCoopApi');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUF1RDtBQUN2RCw4Q0FBK0M7QUFDL0MscUNBQXNDO0FBRXRDLE1BQWEsU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3RDLFlBQVksR0FBWSxFQUFFLEVBQVU7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVmLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSw2QkFBNkIsRUFBRTtZQUNuRixJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUNqQyxPQUFPLEVBQUUsK0JBQStCO1lBQ3hDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDcEQsV0FBVyxFQUFFLGtDQUFrQztTQUNoRCxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxNQUFNLGlCQUFpQixHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDaEYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0Y7QUFsQkQsOEJBa0JDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFdBQWlDO0lBQzlELFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQztRQUM5RCxvQkFBb0IsRUFBRSxDQUFDO2dCQUNyQixVQUFVLEVBQUUsS0FBSztnQkFDakIsa0JBQWtCLEVBQUU7b0JBQ2xCLHFEQUFxRCxFQUFFLHlGQUF5RjtvQkFDaEosb0RBQW9ELEVBQUUsS0FBSztvQkFDM0QseURBQXlELEVBQUUsU0FBUztvQkFDcEUscURBQXFELEVBQUUsK0JBQStCO2lCQUN2RjthQUNGLENBQUM7UUFDRixtQkFBbUIsRUFBRSxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSztRQUN6RCxnQkFBZ0IsRUFBRTtZQUNoQixrQkFBa0IsRUFBRSx1QkFBdUI7U0FDNUM7S0FDRixDQUFDLEVBQUU7UUFDRixlQUFlLEVBQUUsQ0FBQztnQkFDaEIsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLGtCQUFrQixFQUFFO29CQUNsQixxREFBcUQsRUFBRSxJQUFJO29CQUMzRCxxREFBcUQsRUFBRSxJQUFJO29CQUMzRCx5REFBeUQsRUFBRSxJQUFJO29CQUMvRCxvREFBb0QsRUFBRSxJQUFJO2lCQUMzRDthQUNGLENBQUM7S0FDSCxDQUFDLENBQUE7QUFDSixDQUFDO0FBMUJELHdDQTBCQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNoQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBpZ2F0ZXdheSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5Jyk7IFxyXG5pbXBvcnQgbGFtYmRhID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWxhbWJkYScpO1xyXG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY29yZScpO1xyXG5cclxuZXhwb3J0IGNsYXNzIExMQ29vcEFwaSBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgY29uc3RydWN0b3IoYXBwOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihhcHAsIGlkKTtcclxuXHJcbiAgICBjb25zdCBjaGVja2VkT3V0UmVzb3VyY2VzID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnY2hlY2tlZE91dFJlc291cmNlc0Z1bmN0aW9uJywge1xyXG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLkFzc2V0Q29kZSgnc3JjJyksXHJcbiAgICAgIGhhbmRsZXI6ICdjaGVja2VkLW91dC1yZXNvdXJjZXMuaGFuZGxlcicsXHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnbGxjb29wQXBpJywge1xyXG4gICAgICByZXN0QXBpTmFtZTogJ0xha2VsYW5kIExpYnJhcnkgQ29vcGVyYXRpdmUgQVBJJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaXRlbXMgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnaXRlbXMnKTtcclxuICAgIGNvbnN0IGdldEFsbEludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oY2hlY2tlZE91dFJlc291cmNlcyk7XHJcbiAgICBpdGVtcy5hZGRNZXRob2QoJ1BPU1QnLCBnZXRBbGxJbnRlZ3JhdGlvbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29yc09wdGlvbnMoYXBpUmVzb3VyY2U6IGFwaWdhdGV3YXkuSVJlc291cmNlKSB7XHJcbiAgYXBpUmVzb3VyY2UuYWRkTWV0aG9kKCdPUFRJT05TJywgbmV3IGFwaWdhdGV3YXkuTW9ja0ludGVncmF0aW9uKHtcclxuICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xyXG4gICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXHJcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIixcclxuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IFwiJ2ZhbHNlJ1wiLFxyXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUnXCIsXHJcbiAgICAgIH0sXHJcbiAgICB9XSxcclxuICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IGFwaWdhdGV3YXkuUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcclxuICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcclxuICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IFwie1xcXCJzdGF0dXNDb2RlXFxcIjogMjAwfVwiXHJcbiAgICB9LFxyXG4gIH0pLCB7XHJcbiAgICBtZXRob2RSZXNwb25zZXM6IFt7XHJcbiAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxyXG4gICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcclxuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcclxuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcclxuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IHRydWUsXHJcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcclxuICAgICAgfSwgIFxyXG4gICAgfV1cclxuICB9KVxyXG59XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xyXG5uZXcgTExDb29wQXBpKGFwcCwgJ0xMQ29vcEFwaScpO1xyXG5hcHAuc3ludGgoKTtcclxuIl19