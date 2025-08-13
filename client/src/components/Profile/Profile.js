
import logo from '../../assets/crystal_black.png';

const Profile = ({user, userPosts, unlockedPosts}) => {
    return (
      <div className="card">
      
        <div className="flex justify-center">
          <div className="w-32 h-32 text-5xl bg-gradient-to-r from-orange-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="text-center px-6 py-4">
          <h2 className="text-3xl font-semibold text-gray-800">{user.username}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          
        </div>

        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        <div className="flex flex-col justify-center text-center">
          <h2 className="text-2xl font-semibold text-black">Gem Stats</h2>
          <h2 className="text-xl text-[#d52985] font-semibold">Gem Score: {userPosts.length + unlockedPosts.length}</h2>
          <h2 className="text-lg text-gray-600">Number Hidden: {userPosts.length}</h2>
          <h2 className="text-lg text-gray-600">Number Discovered: {unlockedPosts.length}</h2>
        </div>
        
      </div>

    );
  };
  
  export default Profile;