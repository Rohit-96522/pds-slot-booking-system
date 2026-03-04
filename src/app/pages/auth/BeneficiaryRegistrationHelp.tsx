import { Link } from 'react-router';
import { Store, UserPlus, Info, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function BeneficiaryRegistrationHelp() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-blue-600 p-4 rounded-full">
                            <Store className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Registration Help & Guidelines</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about registering for the Public Distribution System (PDS) Portal.
                    </p>
                </div>

                {/* Roles Explanation */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <UserPlus className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">For Beneficiaries</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">Register as a beneficiary if you hold a valid Ration Card and want to book ration collection slots.</p>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                                    <Info className="h-4 w-4 mr-2" /> Required Details
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                                    <li>Full Name & Valid Email</li>
                                    <li>10-digit Phone Number</li>
                                    <li>Valid Ration Card Number</li>
                                    <li>Ration Card Verification Screenshot</li>
                                    <li>Number of Family Members</li>
                                    <li>Current Address & Location Pin</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-indigo-500 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <Store className="h-6 w-6 text-indigo-600" />
                                </div>
                                <CardTitle className="text-xl">For Shopkeepers</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">Register as a shopkeeper if you operate an authorized Fair Price Shop.</p>
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
                                    <Info className="h-4 w-4 mr-2" /> Required Details
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800">
                                    <li>Personal Details (Name, Phone, Email)</li>
                                    <li>Official Fair Price Shop Name</li>
                                    <li>Complete Shop Address</li>
                                    <li>Exact Map Location</li>
                                    <li>Shop Front Image (Optional)</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Step-by-Step Guide */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Step-by-Step Registration Process</CardTitle>
                        <CardDescription className="text-center">Follow these steps carefully to ensure a smooth registration.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">

                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold border-2 border-blue-600">
                                        1
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Select Your Role</h3>
                                    <p className="mt-1 text-gray-600">Choose whether you are registering as a Beneficiary (Ration Card Holder) or a Shopkeeper (Fair Price Shop Owner).</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold border-2 border-blue-600">
                                        2
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Enter Personal Details</h3>
                                    <p className="mt-1 text-gray-600">Provide your full name, a working email address, and a 10-digit mobile number. You will also need to create a secure password.</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold border-2 border-blue-600">
                                        3
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Role-Specific Information</h3>
                                    <p className="mt-1 text-gray-600 mb-2">Depending on the role you selected in Step 1, fill in the specific details:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        <li><strong>Beneficiaries:</strong> Need their Ration Card number and count of family members.</li>
                                        <li><strong>Shopkeepers:</strong> Need their official shop name.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold border-2 border-blue-600">
                                        4
                                    </div>
                                </div>
                                <div className="w-full">
                                    <h3 className="text-lg font-semibold text-gray-900">Provide Ration Verification Screenshot (Beneficiaries)</h3>
                                    <p className="mt-1 text-gray-600 mb-4">To verify your ration card, beneficiaries need to upload a screenshot from the official <a href="https://epds.telangana.gov.in/FoodSecurityAct/?wicket:bookmarkablePage=:nic.fsc.foodsecurity.FscSearch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Telangana EPDS portal <Info className="h-3 w-3" /></a> proving their ration card exists in the system.</p>

                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Example of an acceptable screenshot:</p>
                                        <img
                                            src="/ration-card-example.png"
                                            alt="Example Ration Card Search Result"
                                            className="w-full max-w-2xl rounded shadow-md border border-gray-300"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Make sure the "RATION CARD DETAILS" and "RATION CARD MEMBER DETAILS" sections are clearly visible.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold border-2 border-blue-600">
                                        5
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Pin Your Location</h3>
                                    <p className="mt-1 text-gray-600 mb-2">Location is crucial for finding the nearest shops or for beneficiaries to find you.</p>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2">
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                                            <p className="text-sm text-yellow-800">
                                                <strong>Important:</strong> Click on the interactive map to precisely pin your location. This will automatically try to fill in your text address, but please review and correct the text address if needed to ensure delivery accuracy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <div className="text-center pb-8">
                    <p className="text-gray-600 mb-6">Ready to register or have you resolved your issues?</p>
                    <div className="flex justify-center gap-4">
                        <Button asChild size="lg" className="px-8">
                            <Link to="/register">Go to Registration Page</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="px-8 bg-white">
                            <Link to="/login">Back to Login</Link>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
