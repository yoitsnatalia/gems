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

        <h2 className="text-center text-2xl text-gray-400">--</h2>

        <div className="flex flex-col justify-center text-center">
          <h2 className="text-2xl font-semibold text-[#d52985]">Gem Stats</h2>
          <h2 className="text-xl text-black ">Number Hidden: {userPosts.length}</h2>
          <h2 className="text-xl text-black ">Number Discovered: {unlockedPosts.length}</h2>
        </div>
        
      </div>

      
    );
  };
  
  export default Profile;